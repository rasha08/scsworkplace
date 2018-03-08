import React from 'react';
import { map, get, filter, orderBy } from 'lodash';

import LinkWrapper from './LinkWrapper';
import TaskCard from './task-components/TaskCard';

const ProjectBoardColumn = props => {
  return (
    <div className="col-md-3 column">
      <div className="column-header">
        <h6>
          {props.column.toUpperCase()}
        </h6>
        {props.index === 0
          ? <LinkWrapper
              to={`/add-task/${props.projectNameSlug}`}
              className="btn btn-xs btn-dark right add-task"
            >
              <i className="material-icons">playlist_add</i>
            </LinkWrapper>
          : <div />}
      </div>
      <div className="column-tasks">
        {map(
          filter(props.tasks, task => task.columnIndex === props.index),
          task => (
            <TaskCard
              task={task}
              utils={props.utils}
              projectNameSlug={props.projectNameSlug}
              index={props.index}
              lastIndex={props.lastIndex}
              key={task.taskNameSlug}
            />
          )
        )}
      </div>
    </div>
  );
};

export default ProjectBoardColumn;
