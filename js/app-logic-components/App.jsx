import React, { Component } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { database, auth, googleAuthProvider } from './Firebase';
import { filter, find, indexOf, isEmpty, get, forEach, map } from 'lodash';
import Header from '../incudes/Header';
import Landing from '../main-components/Landing';
import CreateProject from '../main-components/CreateProject';
import NewWorkplaceApplication
  from '../main-components/NewWorkplaceApplication';
import ProjectBoard from '../main-components/ProjectBoard';
import CreateTask from '../main-components/CreateTask';

class App extends Component {
  constructor() {
    super();
    this.state = {
      user: null,
      project: null,
      userProjects: [],
      utils: {},
      filterBy: null
    };

    this.databaseRef = database.ref('/');
  }

  componentDidMount() {
    this.handleAuthStatusChange();
    this.bindUtilsFunctions();
  }

  handleAuthStatusChange() {
    auth.onAuthStateChanged(user => {
      this.setState({ user });
      console.log(user);
      if (!this.state.user) {
        this.signin();
      } else {
        this.getProjectsFromDatabase();
      }
    });
  }

  getProjectsFromDatabase() {
    this.databaseRef.on('value', snapshot => {
      const projects = snapshot.val();
      console.log(projects);
      this.setState({
        userProjects: filter(
          projects,
          project => project.members.indexOf(this.state.user.email) !== -1
        )
      });
    });
  }

  signin() {
    auth.signInWithRedirect(googleAuthProvider);
  }

  bindUtilsFunctions() {
    this.getColumnIndex = this.getColumnIndex.bind(this);
    this.changeTaskColumn = this.changeTaskColumn.bind(this);
    this.assignUserToTask = this.assignUserToTask.bind(this);
    this.assignReviewerToTask = this.assignReviewerToTask.bind(this);
    this.blockTask = this.blockTask.bind(this);
    this.filterTasksBy = this.filterTasksBy.bind(this);
    this.filterTasksByType = this.filterTasksByType.bind(this);
    this.finishSprint = this.finishSprint.bind(this);

    this.setState({
      utils: {
        getColumnIndex: this.getColumnIndex,
        changeTaskColumn: this.changeTaskColumn,
        assignUserToTask: this.assignUserToTask,
        assignReviewerToTask: this.assignReviewerToTask,
        blockTask: this.blockTask,
        filterTasksBy: this.filterTasksBy,
        filterTasksByType: this.filterTasksByType,
        finishSprint: this.finishSprint
      }
    });
  }

  getProjectByNameSlug(nameSlug) {
    return this.state.userProjects.find(
      project => project.projectNameSlug === nameSlug
    );
  }

  getColumnIndex(column, boardColimns) {
    return indexOf(boardColimns, column);
  }

  changeTaskColumn(event, projectUrl, task, newIndex, isDone = false) {
    event.preventDefault();
    event.stopPropagation();

    if (
      task.columnIndex === 0 &&
      !(get(task, 'assigner.displayName') === this.state.user.displayName)
    ) {
      this.assignUserToTask(event, projectUrl, task);
    }

    if (isDone) {
      database
        .ref(`/${projectUrl}/tasks/${task.taskNameSlug}/state`)
        .set('done');
    } else if (task.state === 'done') {
      database
        .ref(`/${projectUrl}/tasks/${task.taskNameSlug}/state`)
        .set('active');
    }

    database
      .ref(`/${projectUrl}/tasks/${task.taskNameSlug}/columnIndex`)
      .set(newIndex);
  }

  assignUserToTask(event, projectUrl, task) {
    event.preventDefault();
    event.stopPropagation();

    if (task.state !== 'blocked') {
      if (get(task, 'assigner.displayName') === this.state.user.displayName) {
        database
          .ref(`/${projectUrl}/tasks/${task.taskNameSlug}/assigner`)
          .set('');
        this.moveTaskToFirstColimnIfNeeded(event, projectUrl, task);
      } else {
        database.ref(`/${projectUrl}/tasks/${task.taskNameSlug}/assigner`).set({
          displayName: this.state.user.displayName,
          email: this.state.user.email
        });
      }
    }
  }

  assignReviewerToTask(event, projectUrl, task) {
    event.preventDefault();
    event.stopPropagation();

    if (get(task, 'reviewer.displayName') === this.state.user.displayName) {
      database
        .ref(`/${projectUrl}/tasks/${task.taskNameSlug}/reviewer`)
        .set('');
    } else if (
      !isEmpty(task.assigner) &&
      get(task, 'assigner.displayName') !== this.state.user.displayName
    ) {
      database.ref(`/${projectUrl}/tasks/${task.taskNameSlug}/reviewer`).set({
        displayName: this.state.user.displayName,
        email: this.state.user.email
      });
    }
  }

  blockTask(event, projectUrl, task) {
    event.preventDefault();
    event.stopPropagation();

    if (task.state === 'blocked') {
      database
        .ref(`/${projectUrl}/tasks/${task.taskNameSlug}/state`)
        .set('active');
    } else if (task.state === 'done') {
      return;
    } else {
      database
        .ref(`/${projectUrl}/tasks/${task.taskNameSlug}/state`)
        .set('blocked');
      this.moveTaskToFirstColimnIfNeeded(event, projectUrl, task);
    }
  }

  moveTaskToFirstColimnIfNeeded(event, projectUrl, task) {
    if (task.columnIndex !== 0) {
      this.changeTaskColumn(event, projectUrl, task, 0);
    }
  }

  getTaskByNameSlug(project, taskNameSlug) {
    return find(
      get(project, 'tasks'),
      singleTask => singleTask.taskNameSlug === taskNameSlug
    );
  }

  filterTasksBy(type) {
    console.log('type', type);
    if (type === this.state.filterTasksBy) {
      this.setState({
        filterTasksBy: null
      });

      return;
    }

    this.setState({
      filterTasksBy: type
    });
  }

  filterTasksByType(tasks) {
    if (isEmpty(tasks)) {
      return [];
    } else if (!this.state.filterTasksBy) {
      return tasks;
    } else if (this.state.filterTasksBy === 'highPriorityTask') {
      return filter(tasks, task => task.highPriorityTask);
    }

    return filter(
      tasks,
      task =>
        get(task[this.state.filterTasksBy], 'displayName') ===
        this.state.user.displayName
    );
  }

  finishSprint(tasks, lastColumn, activeSprint, projectUrl) {
    console.log('FINISH SPRINT');
    forEach(tasks, task => {
      if (task.columnIndex === lastColumn) {
        console.log(task);
        database
          .ref(`/${projectUrl}/tasks/${task.taskNameSlug}/sprint`)
          .set(activeSprint);
      } else {
        console.log(task);
        database
          .ref(`/${projectUrl}/tasks/${task.taskNameSlug}/sprint`)
          .set(activeSprint + 1);
      }
    });

    database.ref(`/${projectUrl}/activeSprint`).set(activeSprint + 1);
  }

  render() {
    return (
      <div className="app">
        <div>
          <Header />
          <BrowserRouter>
            <div>
              <Switch>
                <Route
                  exact
                  path="/"
                  component={props => (
                    <Landing
                      user={this.state.user}
                      projects={this.state.userProjects}
                    />
                  )}
                />
                <Route
                  exact
                  path="/projects"
                  component={props => (
                    <Landing
                      user={this.state.user}
                      projects={this.state.userProjects}
                    />
                  )}
                />
                <Route
                  exact
                  path="/create-project"
                  component={props => <CreateProject user={this.state.user} />}
                />
                <Route
                  path="/projects/edit/:projectUrlSlug"
                  component={props => (
                    <CreateProject
                      user={this.state.user}
                      project={this.getProjectByNameSlug(
                        props.match.params.projectUrlSlug
                      )}
                      utils={this.state.utils}
                    />
                  )}
                />
                <Route
                  exact
                  path="/create-new-workplace"
                  component={props => (
                    <NewWorkplaceApplication user={this.state.user} />
                  )}
                />
                <Route
                  path="/projects/:projectUrlSlug/tasks/:taskUrlSlug"
                  component={props => {
                    let project = this.getProjectByNameSlug(
                      props.match.params.projectUrlSlug
                    );
                    let task = this.getTaskByNameSlug(
                      project,
                      props.match.params.taskUrlSlug
                    );
                    return (
                      <CreateTask
                        user={this.state.user}
                        project={project}
                        task={task}
                        utils={this.state.utils}
                      />
                    );
                  }}
                />
                <Route
                  path="/projects/:projectUrlSlug"
                  component={props => (
                    <ProjectBoard
                      user={this.state.user}
                      project={this.getProjectByNameSlug(
                        props.match.params.projectUrlSlug
                      )}
                      utils={this.state.utils}
                      filterBy={this.state.filterTasksBy}
                    />
                  )}
                />
                <Route
                  path="/add-task/:projectUrlSlug"
                  component={props => (
                    <CreateTask
                      user={this.state.user}
                      project={this.getProjectByNameSlug(
                        props.match.params.projectUrlSlug
                      )}
                      utils={this.state.utils}
                    />
                  )}
                />
              </Switch>
            </div>
          </BrowserRouter>
        </div>
      </div>
    );
  }
}

export default App;
