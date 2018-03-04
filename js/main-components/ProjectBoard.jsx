import React from 'react';
import { map, get } from 'lodash';
import Footer from '../incudes/Footer';
import Loader from '../incudes/Loader';
import ProjectBoardColumn from '../helpers/ProjectBoardColumn';

const ProjectBoard = props => {
  let porojectColumns = get(props.project, 'boardColumns');
  let projectNameSlug = get(props.project, 'projectNameSlug');
  let tasks = get(props.project, 'tasks') || [];
  let lastColumnIndex = get(porojectColumns, 'length') - 1;
  return (
    <div>
      <main>
        <div id="content">
          {!tasks
            ? <Loader />
            : <div className="container-fluid" id="board">
                <div className="row">
                  {map(porojectColumns, column => (
                    <ProjectBoardColumn
                      column={column}
                      projectNameSlug={projectNameSlug}
                      tasks={tasks}
                      utils={props.utils}
                      index={props.utils.getColumnIndex(
                        column,
                        porojectColumns
                      )}
                      lastIndex={lastColumnIndex}
                      key={column}
                    />
                  ))}
                </div>
              </div>}

        </div>
      </main>
      <Footer project={props.project} />
    </div>
  );
};

export default ProjectBoard;
