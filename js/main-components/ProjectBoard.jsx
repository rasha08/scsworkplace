import React from 'react';

const ProjectBoard = props => {
  return (
    <main>
      <div id="content">
        <div className="container-fluid" id="board">
          {console.log('PROJECT BOARD')}
          <div className="row">
            <div className="col-md-3 column">
              <div className="column-header">
                <h5>TO DO</h5>
              </div>
              <div className="column-tasks">
                <p>TRALALA</p>
              </div>
            </div>
            <div className="col-md-3 column">
              <div className="column-header">
                <h5>IN PROGRES</h5>
              </div>
              <div className="column-tasks">
                <p>TRALALA</p>
              </div>
            </div>
            <div className="col-md-3 column">
              <div className="column-header">
                <h5>REVIEW / TEST</h5>
              </div>
              <div className="column-tasks">
                <p>TRALALA</p>
              </div>
            </div>
            <div className="col-md-3 column">
              <div className="column-header">
                <h5>DONE</h5>
              </div>
              <div className="column-tasks">
                <p>TRALALA</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default ProjectBoard;
