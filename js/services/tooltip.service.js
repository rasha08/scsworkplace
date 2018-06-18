export const getTooltipMessage = type => {
  switch (type) {
    case 'moveBack':
      return 'Move task to a previous column';
      break;
    case 'assign':
      return 'Assing yourself to this task';
      break;
    case 'block':
      return 'Mark this task as blocked';
      break;
    case 'review':
      return 'Assing yourself as a reviewer of this task';
      break;
    case 'moveForward':
      return 'Move task to next column';
      break;
    case 'projects':
      return 'See all your projects list';
      break;
    case 'editProject':
      return 'Edit current project';
      break;
    case 'specification':
      return 'Open project SPECIFICATION';
      break;
    case 'backlog':
      return 'Open project BACKLOG';
      break;
    case 'previousSprints':
      return 'Show PREVIOUS SPRINTS';
      break;
    case 'notes':
      return 'Show project NOTES';
      break;
    case 'goals':
      return 'Show only tasks that are in SPRINT GOALS';
      break;
    case 'highPriority':
      return 'Show only tasks that are HIGH PRIORITY';
      break;
    case 'assigner':
      return 'Show only tasks that you are ASSIGNED ON';
      break;
    case 'reviewer':
      return 'Show only tasks that you are assigned as REVIEWER';
      break;
    case 'closeSprint':
      return 'CLOSE CURRENT SPRINT AND START NEW ONE';
      break;
    case 'addTask':
      return 'Create new task in current sprint';
      break;
    default:
      return ''
      break;
  }
};