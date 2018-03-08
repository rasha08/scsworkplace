import React from 'react';
import { map, get, filter } from 'lodash';
import Footer from '../incudes/Footer';
import Loader from '../incudes/Loader';
import ProjectBoardColumn from '../helpers/ProjectBoardColumn';

const ProjectBoard = props => {
  let tasks = [];
  let projectColumns = get(props.project, 'boardColumns');
  let projectNameSlug = get(props.project, 'projectNameSlug');
  if (props.utils.filterTasksByType) {
    tasks = props.utils.filterTasksByType(get(props.project, 'tasks'))
    tasks = filter(tasks, task =>get(task, 'sprint') === get(props.project, 'activeSprint'));
  } 
  let lastColumnIndex = get(projectColumns, 'length') - 1;
  return (
    <div>
      <main>
        <div id="content">
          {!tasks
            ? <Loader />
            : <div className="container-fluid" id="board">
                <div className="row">
                  {map(projectColumns, column => (
                    <ProjectBoardColumn
                      column={column}
                      projectNameSlug={projectNameSlug}
                      tasks={tasks}
                      utils={props.utils}
                      index={props.utils.getColumnIndex(
                        column,
                        projectColumns
                      )}
                      lastIndex={lastColumnIndex}
                      key={column}
                    />
                  ))}
                </div>
              </div>}

        </div>
      </main>
      <Footer
        project={props.project}
        utils={props.utils}
        filterBy={props.filterBy}
        tasks={tasks}
        lastColumnIndex={lastColumnIndex} />
    </div>
  );
};

export default ProjectBoard;
