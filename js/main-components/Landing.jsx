import React, { Component } from 'react';
import { get, isEmpty } from 'lodash';
import UserProjects from './UserProjects';
import LinkWrapper from '../helpers/LinkWrapper';

const NoProjectLanding = () => (
  <div>
    <p className="lead">
      You are currently not assigned to any poject, you can create a new project if you are par of existing WORKPLACE or create a Workplace and organize your team!
      {' '}
    </p>
    <p className="lead">
      <LinkWrapper to="/create-project" className="btn btn-lg btn-secondary">
        Create Project
      </LinkWrapper>
      <LinkWrapper
        to="/create-new-workplace"
        className="btn btn-lg btn-secondary"
      >
        Create Workplace
      </LinkWrapper>
    </p>
  </div>
);

const Landing = props => (
  <main role="main" className="inner cover">
    {console.log(props.projects)}
    <div id="content">
      <h1 className="cover-heading">
        {!isEmpty(props.projects)
          ? `Welcome ${get(props.user, 'displayName')} - your pojects list:`
          : 'Welcome to Smart Cat Solutions Workplace'}
      </h1>
      {!isEmpty(props.projects)
        ? <div>
            <LinkWrapper
              to="/create-project"
              className="btn btn-lg btn-dark"
              id="create-project"
            >
              Create Project
            </LinkWrapper>
            <LinkWrapper
              to="/create-new-workplace"
              className="btn btn-lg btn-secondary"
              id="create-workplace"
            >
              Create Workplace
            </LinkWrapper>
            <hr />

            <UserProjects projects={props.projects} />
          </div>
        : <NoProjectLanding />}
    </div>
  </main>
);

export default Landing;
