import React from 'react';

const TaskTooltip = props => {
  const getTooltipMessage = element => {
    switch (element) {
      case 'moveBack':
        return 'Move task to a previous column';
        break;
      case 'assign':
        return 'Assing yourself to this task';
        break;
      case 'block':
        return 'Mark this task as blocked';
        break;
      case 'review':
        return 'Assing yourself as a reviewer of this task';
        break;
      case 'moveForward':
        return 'Move task to next column';
        break;
      default:
        break;
    }
  };

  return (
    <div className="tool-tip">
      <p className="flow-text">{getTooltipMessage(props.value)}</p>
    </div>
  );
};

export default TaskTooltip;
