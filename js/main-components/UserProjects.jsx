import React from 'react';
import { filter, map } from 'lodash';

import ProjectCard from '../helpers/ProjectCard';

const UserProjects = props => {
  return props.projects
    ? <div className="container-fluid col-md-12">
        {map(props.projects, project => (
          <ProjectCard project={project} key={project.projectNameSlug} />
        ))}
      </div>
    : <div />;
};

export default UserProjects;
