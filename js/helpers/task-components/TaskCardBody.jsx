import React from 'react';
import { isEmpty, get } from 'lodash';

const TaskCardBody = props => {
  const taskBodyCssClass = props.task.state === 'blocked'
    ? 'card-body top blocked'
    : props.task.state === 'done' ? 'card-body top done' : 'card-body top';
  return (
    <div className={taskBodyCssClass}>
      <h6 className="card-title">{props.task.name}</h6>
      <small className="card-text">
        {get(props.task, 'description')
          ? props.task.description.slice(0, 100)
          : ''}
        ...
      </small>
    </div>
  );
};

export default TaskCardBody;
