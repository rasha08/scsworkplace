import React from 'react';
import { getTooltipMessage } from '../../services/tooltip.service';


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
          title={getTooltipMessage('moveBack')}
        >
          assignment_return
        </i>
        <i
          className={
            props.task.assigner ? 'material-icons assigned' : 'material-icons'
          }
          onClick={event => assignUser(event)}
          title={getTooltipMessage('assign')}
        >
          assignment_ind
        </i>
        <i className="material-icons"
          onClick={event => blockTask(event)}
          title={getTooltipMessage('block')}
        >
          block
        </i>
        <i
          className={
            props.task.reviewer ? 'material-icons assigned' : 'material-icons'
          }
          onClick={event => assignReviewerToTask(event)}
          title={getTooltipMessage('review')}
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
          title={getTooltipMessage('moveForward')}
        >
          forward
        </i>
      </div>
    
    </div>
  );
};

export default TaskActions;
