import React from 'react';
import { Redirect } from 'react-router';

const NewWorkplaceApplication = props => {
  return (
    <main>
      <div id="content">
        <div className="create-project new-workplace-application-not-ready">
          <h1>WE ARE CURRENTLY DEVELOPING THIS FEATURE...</h1>
          <div className="form-group">
            <label />
            <input
              type="email"
              className="form-control"
              id="exampleInputEmail1"
              aria-describedby="emailHelp"
              placeholder="Enter email"
            />
            <small id="emailHelp" className="form-text">
              Please enter your email and we well contact you when this feature is implemented.
            </small>
          </div>
          <button className="btn btn-primary">Submit</button>
        </div>
      </div>
    </main>
  );
};

export default NewWorkplaceApplication;
