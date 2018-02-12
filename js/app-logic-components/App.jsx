import React, { Component } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { database, auth, googleAuthProvider } from './Firebase';
import { filter, find } from 'lodash';
import Header from '../incudes/Header';
import Footer from '../incudes/Footer';
import Landing from '../main-components/Landing';
import CreateProject from '../main-components/CreateProject';
import NewWorkplaceApplication
  from '../main-components/NewWorkplaceApplication';
import ProjectBoard from '../main-components/ProjectBoard';

class App extends Component {
  constructor() {
    super();
    this.state = {
      user: null,
      project: null,
      userProjects: []
    };

    this.databaseRef = database.ref('/');
  }

  componentDidMount() {
    this.handleAuthStatusChange();
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

  getProjectByNameSlug(nameSlug) {
    return this.state.userProjects.find(
      project => project.projectNameSlug === nameSlug
    );
  }

  render() {
    return (
      <div className="app">
        <div>
          <Header />
          <BrowserRouter>
            <div className="app">
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
                  path="/projects/:projectUrlSlug"
                  component={props => (
                    <ProjectBoard
                      user={this.state.user}
                      project={this.getProjectByNameSlug(
                        props.match.params.projectUrlSlug
                      )}
                    />
                  )}
                />
              </Switch>
            </div>
          </BrowserRouter>
          <Footer />
        </div>
      </div>
    );
  }
}

export default App;
