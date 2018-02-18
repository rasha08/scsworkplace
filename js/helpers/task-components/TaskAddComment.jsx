import React from 'react';

const TaskAddComment = props => {
  return (
    <div className="input-group mb-3">
      <input
        type="text"
        className="form-control"
        placeholder="Add Comment..."
        aria-label="Add Comment..."
        aria-describedby="basic-addon2"
        onChange={event => props.handleChange(event)}
      />
      <div className="input-group-append">
        <button
          className="btn btn-outline-secondary"
          type="button"
          onClick={() => props.submitComment()}
        >
          Comment
        </button>
      </div>
    </div>
  );
};

export default TaskAddComment;
