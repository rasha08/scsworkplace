import React, { Component } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { database, auth, googleAuthProvider } from './Firebase';
import { filter, find, indexOf, isEmpty, get } from 'lodash';
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
      fiterBy: null
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

    this.setState({
      utils: {
        getColumnIndex: this.getColumnIndex,
        changeTaskColumn: this.changeTaskColumn,
        assignUserToTask: this.assignUserToTask,
        assignReviewerToTask: this.assignReviewerToTask,
        blockTask: this.blockTask
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
      !(task.assigner === this.state.user.displayName)
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
      if (task.assigner === this.state.user.displayName) {
        database
          .ref(`/${projectUrl}/tasks/${task.taskNameSlug}/assigner`)
          .set('');
        this.moveTaskToFirstColimnIfNeeded(event, projectUrl, task);
      } else {
        database
          .ref(`/${projectUrl}/tasks/${task.taskNameSlug}/assigner`)
          .set(this.state.user.displayName);
      }
    }
  }

  assignReviewerToTask(event, projectUrl, task) {
    event.preventDefault();
    event.stopPropagation();

    if (task.reviewer === this.state.user.displayName) {
      database
        .ref(`/${projectUrl}/tasks/${task.taskNameSlug}/reviewer`)
        .set('');
    } else if (
      !isEmpty(task.assigner) &&
      task.assigner !== this.state.user.displayName
    ) {
      database
        .ref(`/${projectUrl}/tasks/${task.taskNameSlug}/reviewer`)
        .set(this.state.user.displayName);
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
                    />
                  )}
                />
                <Route
                  path="/projects/edit/:projectUrlSlug"
                  component={props => (
                    <ProjectBoard
                      user={this.state.user}
                      project={this.getProjectByNameSlug(
                        props.match.params.projectUrlSlug
                      )}
                      utils={this.state.utils}
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
