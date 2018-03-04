import React from 'react';
import LinkWrapper from '../LinkWrapper';

const FooterMenu = props => (
  <div className="container">
    <div className="row">
      <LinkWrapper className="col" to="/projects">
        <i className="material-icons">view_comfy</i>
      </LinkWrapper>
      <div className="col">
        <i className="material-icons">create</i>
      </div><a
        href={props.project.specification}
        target="blank"
        className="col"
      >
        <i className="material-icons">chrome_reader_mode</i>
      </a>
      <div className="col">
        <i className="material-icons">layers</i>
      </div><div className="col">
        <i className="material-icons">history</i>
      </div>
      <div className="col">
        <i className="material-icons">note</i>
      </div><div className="col">
        <i className="material-icons">local_activity</i>
      </div><div className="col">
        <i className="material-icons">assistant_photo</i>
      </div><div className="col">
        <i className="material-icons">assignment_ind</i>
      </div><div className="col">
        <i className="material-icons">beenhere</i>
      </div><div className="col">
        <i className="material-icons">grid_off</i>
      </div>
    </div>
  </div>
);

export default FooterMenu;
