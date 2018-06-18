import React from 'react';
import LinkWrapper from '../LinkWrapper';
import { getTooltipMessage } from '../../services/tooltip.service';

const FooterMenu = props => {
  console.log(props.tasks);
  let finishSprint = () =>
    props.utils.finishSprint(
      props.tasks,
      props.lastColumnIndex,
      props.project.activeSprint,
      props.project.projectNameSlug
    );
  const getCssClass = type =>
    type === props.filterBy ? 'material-icons selected' : 'material-icons';

  return (
    <div className="container">
      <div className="row">
        <LinkWrapper className="col"
          title={getTooltipMessage('projects')}
          to="/projects"
        >
          <i className="material-icons">view_comfy</i>
        </LinkWrapper>
        <LinkWrapper
          to={`/projects/edit/${props.project.projectNameSlug}`}
          className="col"
          title={getTooltipMessage('editProject')}
        >
          <i className="material-icons">create</i>
        </LinkWrapper><a
          href={props.project.specification}
          target="blank"
          className="col"
          title={getTooltipMessage('specification')}
        >
          <i className="material-icons">chrome_reader_mode</i>
        </a>
        <div className="col"
          title={getTooltipMessage('backlog')}
          onClick={() => { }}
        >
          <i className="material-icons">
            layers
          </i>
        </div><div className="col"
          title={getTooltipMessage('previousSprints')}
        >
          <i className="material-icons">history</i>
        </div>
        <div className="col"
          title={getTooltipMessage('notes')}
        >
          <i className="material-icons">note</i>
        </div><div className="col"
          title={getTooltipMessage('goals')}
        >
          <i className="material-icons">local_activity</i>
        </div><div
          className="col"
          title={getTooltipMessage('highPriority')}
          onClick={() => props.utils.filterTasksBy('highPriorityTask')}
        >
          <i className={getCssClass('highPriorityTask')}>assistant_photo</i>
        </div><div
          className="col"
          title={getTooltipMessage('assigner')}
          onClick={() => props.utils.filterTasksBy('assigner')}
        >
          <i className={getCssClass('assigner')}>assignment_ind</i>
        </div><div
          className="col"
          title={getTooltipMessage('reviewer')}
          onClick={() => props.utils.filterTasksBy('reviewer')}
        >
          <i className={getCssClass('reviewer')}>beenhere</i>
        </div><div
          className="col"
          title={getTooltipMessage('closeSprint')}
          onClick={() => {
            finishSprint();
          }}
        >
          <i className="material-icons">grid_off</i>
        </div>
      </div>
    </div>
  );
};

export default FooterMenu;
