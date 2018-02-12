import React from 'react';
import { map, get } from 'lodash';

const ProjectBoardColumn = props => (
  <div className="col-md-3 column">
    <div className="column-header">
      <h6>
        {props.column.toUpperCase()}
      </h6>
      <div className="btn btn-xs btn-dark right add-task">+</div>
    </div>
    <div className="column-tasks">
      {map(props.tasks, task => <p>{get(task, 'name')}</p>)}
    </div>
  </div>
);

export default ProjectBoardColumn;
