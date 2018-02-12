import React from 'react';
import { map, get } from 'lodash';

import ProjectBoardColumn from '../helpers/ProjectBoardColumn';

const ProjectBoard = props => {
  console.log(props);
  return (
    <main>
      <div id="content">
        <div className="container-fluid" id="board">
          {console.log('PROJECT BOARD')}
          <div className="row">
            {map(get(props.project, 'boardColumns'), column => (
              <ProjectBoardColumn column={column} key={column} />
            ))}
          </div>
        </div>
      </div>
    </main>
  );
};

export default ProjectBoard;
