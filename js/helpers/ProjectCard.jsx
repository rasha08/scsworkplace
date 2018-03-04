import React from 'react';
import LinkWrapper from './LinkWrapper';

const ProjectCard = props => (
  <LinkWrapper
    className="card text-white bg-dark col-md-4 project-card"
    to={`/projects/${props.project.projectNameSlug}`}
    style={{ opacity: 0.9 }}
  >
    <div className="card-header">{`Project Start Date: ${props.project.startDate}`}</div>
    <div className="card-body">
      <h5 className="card-title">{props.project.name}</h5>
      <p className="card-text">
        {props.project.description}
      </p>
    </div>
  </LinkWrapper>
);

export default ProjectCard;
