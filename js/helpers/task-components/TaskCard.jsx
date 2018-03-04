import React from 'react';
import LinkWrapper from '../LinkWrapper';
import TaskActions from './TaskActions';
import TaskCardHeader from './TaskCardHeader';
import TaskCardBody from './TaskCardBody';

const TaskCard = props => {
  return (
    <LinkWrapper
      className={`card task text-white bg-dark col-md-12 ${props.task.highPriorityTask ? 'high-priority' : ''}`}
      to={`/projects/${props.projectNameSlug}/tasks/${props.task.taskNameSlug}`}
      style={{ opacity: 0.9 }}
    >
      <TaskCardHeader task={props.task} />
      <TaskCardBody task={props.task} />
      <TaskActions
        index={props.index}
        lastIndex={props.lastIndex}
        task={props.task}
        utils={props.utils}
        projectNameSlug={props.projectNameSlug}
      />
    </LinkWrapper>
  );
};

export default TaskCard;
