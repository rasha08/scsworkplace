import React from 'react';
import TaskType from './TaskType';

const TaskCardHeader = props => (
  <div className="card-header">
    <TaskType type={props.task.type} />
    {`assigner: ${props.task.assigner ? props.task.assigner.displayName : 'unassigned'}`}
    <span className="badge">{props.task.label}</span>
  </div>
);

export default TaskCardHeader;
