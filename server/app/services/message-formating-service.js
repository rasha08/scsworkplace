const _ = require('lodash');

const formatChangeMessage = (change, original, projects) => {
  const projectName = _.findKey(change);
  const taskNameSlug = _.findKey(_.get(change[_.findKey(change)], 'tasks'));
  const onlyChange = _.get(change, `${projectName}.tasks.${taskNameSlug}`);
  const isNewTask = _.has(onlyChange, 'creationDate')

  console.log(onlyChange);

  if (_.has(onlyChange, 'columnIndex') && !isNewTask) {
    return getColumnChangeIndexMessage(projects, projectName, onlyChange, original);
  } else if (_.has(onlyChange, 'assigner') && !isNewTask) {
    return getAssignerChangeMessage(projects, projectName, onlyChange, original);
  } else if (_.has(onlyChange, 'reviewer') && !isNewTask) {
    return getReviewerChangeMessage(projects, projectName, onlyChange, original);
  } else if (_.has(onlyChange, 'state') && !isNewTask) {
    return getStateChangeMessage(projects, projectName, onlyChange, original);
  }
};

const formatMessageProperty = (projects, projectName, task) => {
  return _.toUpper(
    _.get(projects, `${projectName}.boardColumns`)[task.columnIndex]
  );
};

const getColumnChangeIndexMessage = (projects, projectName, onlyChange, original) => {
  let from;
  let to;
  if (_.get(onlyChange, 'columnIndex') > _.get(original, 'columnIndex')) {
    from = formatMessageProperty(projects, projectName, original);
    to = formatMessageProperty(projects, projectName, onlyChange);
  } else {
    to = formatMessageProperty(projects, projectName, original);
    from = formatMessageProperty(projects, projectName, onlyChange);
  }

  return `Task ${boldElement(original.name)} has been moved from ${boldElement(from)} to ${boldElement(to)}`;
};

const boldElement = (showValue, color = 'snow') => {
  return `<b style="color:${color}; font-size:22px; font-weight:bold">${showValue}</b>`
}

const getAssignerChangeMessage = (projects, projectName, onlyChange, original) => {
  let action;
  let user;
  let descriptor;
  if (_.get(onlyChange, 'assigner')) {
    action = 'assigned';
    user = _.get(onlyChange, 'assigner.displayName');
    descriptor = 'to';
  } else {
    action = 'deassigned';
    user = _.get(original, 'assigner.displayName');
    descriptor = 'from';
  }

  return `User ${boldElement(user)} has ${boldElement(action)} himself / herself  ${descriptor} ${boldElement(original.name)}`;
}

const getReviewerChangeMessage = (projects, projectName, onlyChange, original) => {
  let action;
  let user;
  let descriptor;
  if (_.get(onlyChange, 'reviewer')) {
    action = 'assigned';
    user = _.get(onlyChange, 'reviewer.displayName');
    descriptor = 'to';
  } else {
    action = 'deassigned';
    user = _.get(original, 'reviewer.displayName');
    descriptor = 'from';
  }

  return `User ${boldElement(user)} has ${boldElement(action)} himself / herself  as a ${boldElement('Reviewer')} of ${boldElement(original.name)}`;
}

const getStateChangeMessage = (projects, projectName, onlyChange, original) => {
  if (_.get(onlyChange, 'state') === 'blocked') {
    return `Task ${boldElement(original.name)} is now ${boldElement('BLOCKED', 'firebrick')}`
  } else if (_.get(onlyChange, 'state') === 'active' && (_.get(original, 'state') === 'blocked')) {
    return `Task ${boldElement(original.name)} is now ${boldElement('UNBLOCKED', 'olive')}`
  } else if (_.get(onlyChange, 'state') === 'done') {
    return `Task ${boldElement(original.name)} has been marked as ${boldElement('DONE', 'green')}`
  }
}

module.exports = {
  formatChangeMessage
};
