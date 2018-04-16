import React from 'react';
import TaskTooltip from './taskActionTooltip';

const TaskActions = props => {
  const changeTaskColumn = (event, direction) => {
    let index;
    if (direction === 'left' && props.index !== 0) {
      index = props.index - 1;
      props.utils.changeTaskColumn(
        event,
        props.projectNameSlug,
        props.task,
        index
      );
    } else if (direction === 'right' && props.index !== props.lastIndex) {
      index = props.index + 1;
      let isDone = index === props.lastIndex;
      props.utils.changeTaskColumn(
        event,
        props.projectNameSlug,
        props.task,
        index,
        isDone
      );
    }
  };

  const assignUser = event => {
    props.utils.assignUserToTask(event, props.projectNameSlug, props.task);
  };

  const assignReviewerToTask = event => {
    props.utils.assignReviewerToTask(event, props.projectNameSlug, props.task);
  };

  const blockTask = event => {
    props.utils.blockTask(event, props.projectNameSlug, props.task);
  };

  const absorbClick = event => {
    event.preventDefault();
    return false;
  };

  return (
    <div>
      <div className="card-body bottom" onClick={$event => absorbClick($event)}>
        <i
          className={
            props.index === 0 ? 'material-icons disabled' : 'material-icons'
          }
          onClick={event => changeTaskColumn(event, 'left')}
        >
          assignment_return
        </i>
        <i
          className={
            props.task.assigner ? 'material-icons assigned' : 'material-icons'
          }
          onClick={event => assignUser(event)}
        >
          assignment_ind
        </i>
        <i className="material-icons" onClick={event => blockTask(event)}>
          block
        </i>
        <i
          className={
            props.task.reviewer ? 'material-icons assigned' : 'material-icons'
          }
          onClick={event => assignReviewerToTask(event)}
        >
          assignment_turned_in
        </i>
        <i
          className={
            props.task.state === 'blocked'
              ? 'material-icons disabled'
              : 'material-icons'
          }
          onClick={event => changeTaskColumn(event, 'right')}
        >
          forward
        </i>
      </div>
      {/* <TaskTooltip value={tooltipedElement} /> */}
    </div>
  );
};

export default TaskActions;
