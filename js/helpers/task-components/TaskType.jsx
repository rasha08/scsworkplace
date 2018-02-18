import React from 'react';

const TaskType = (props) => {
  let taskIcon;
  let color;
  switch(props.type) {
    case 'bug':
      taskIcon = 'bug_report';
      color = 'firebrick';
      break;
    case 'improvement':
      taskIcon = 'trending_up';
      color = 'olive';
      break;
    case 'maintenance':
      taskIcon = 'perm_data_setting';
      color = 'lightblue'
      break;
    default:
      taskIcon = 'event_note';
      color = 'papayawhip'
      break;
  }

  return <i className="material-icons" style={{color: color}}>{taskIcon}</i>
}

export default TaskType;
