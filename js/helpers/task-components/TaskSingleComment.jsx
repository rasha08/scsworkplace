import React from 'react';
import { get } from 'lodash';

const TaskSingleComment = props => {
  return (
    <div className="col-md-12 alert alert-dark comment-alert" role="alert">
      <span className="comment-user">
        {get(props.comment, 'user.displayName')}
      </span>
      <span className="comment-comment">{get(props.comment, 'comment')}</span>
      <span className="comment-date">{get(props.comment, 'date')}</span>

    </div>
  );
};

export default TaskSingleComment;
