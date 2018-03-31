const _ = require('lodash');
const userNotifyService = require('./user-notify-service');

const formatChangeMessage = (change, original, projects) => {
  const projectName = _.findKey(change);
  const taskNameSlug = _.findKey(_.get(change[_.findKey(change)], 'tasks'));
  const onlyChange = _.get(change, `${projectName}.tasks.${taskNameSlug}`);
  const isNewTask = _.has(onlyChange, 'creationDate');

  if (_.has(onlyChange, 'creationDate')) {
    return;
  } else if (_.has(onlyChange, 'columnIndex')) {
    return getColumnChangeIndexMessage(
      projects,
      projectName,
      onlyChange,
      original
    );
  } else if (_.has(onlyChange, 'assigner')) {
    return getAssignerChangeMessage(
      projects,
      projectName,
      onlyChange,
      original
    );
  } else if (_.has(onlyChange, 'reviewer')) {
    return getReviewerChangeMessage(
      projects,
      projectName,
      onlyChange,
      original
    );
  } else if (_.has(onlyChange, 'state')) {
    return getStateChangeMessage(projects, projectName, onlyChange, original);
  } else if (_.has(onlyChange, 'comments')) {
    let newComment = _.get(
      onlyChange['comments'],
      `${_.findKey(onlyChange['comments'])}`
    );

    return getCommentChangeMessage(projects, projectName, newComment, original);
  }
};

const formatMessageProperty = (projects, projectName, task) => {
  return _.toUpper(
    _.get(projects, `${projectName}.boardColumns`)[task.columnIndex]
  );
};

const getColumnChangeIndexMessage = (
  projects,
  projectName,
  onlyChange,
  original
) => {
  const from = formatMessageProperty(projects, projectName, original);
  const to = formatMessageProperty(projects, projectName, onlyChange);

  return `Task ${boldElement(original.name)} has been moved from ${boldElement(from)} to ${boldElement(to)}`;
};

const getAssignerChangeMessage = (
  projects,
  projectName,
  onlyChange,
  original
) => {
  let action;
  let user;
  let descriptor;
  if (_.get(onlyChange, 'assigner')) {
    action = 'assigned';
    user = _.get(onlyChange, 'assigner.displayName');
    descriptor = 'to';
    userNotifyService.excludeUserFromNotification(
      _.get(onlyChange, 'assigner.email')
    );
  } else {
    action = 'deassigned';
    user = _.get(original, 'assigner.displayName');
    descriptor = 'from';
    userNotifyService.excludeUserFromNotification(
      _.get(original, 'assigner.email')
    );
  }

  return `User ${boldElement(user)} has ${boldElement(action)} himself / herself  ${descriptor} ${boldElement(original.name)}`;
};

const getReviewerChangeMessage = (
  projects,
  projectName,
  onlyChange,
  original
) => {
  let action;
  let user;
  let descriptor;
  if (_.get(onlyChange, 'reviewer')) {
    action = 'assigned';
    user = _.get(onlyChange, 'reviewer.displayName');
    descriptor = 'to';
    userNotifyService.excludeUserFromNotification(
      _.get(onlyChange, 'reviewer.email')
    );
  } else {
    action = 'deassigned';
    user = _.get(original, 'reviewer.displayName');
    descriptor = 'from';
    userNotifyService.excludeUserFromNotification(
      _.get(original, 'reviewer.email')
    );
  }

  return `User ${boldElement(user)} has ${boldElement(action)} himself / herself  as a ${boldElement('Reviewer')} of ${boldElement(original.name)}`;
};

const getStateChangeMessage = (projects, projectName, onlyChange, original) => {
  if (_.get(onlyChange, 'state') === 'blocked') {
    return `Task ${boldElement(original.name)} is now ${boldElement('BLOCKED', 'firebrick')}`;
  } else if (
    _.get(onlyChange, 'state') === 'active' &&
    _.get(original, 'state') === 'blocked'
  ) {
    return `Task ${boldElement(original.name)} is now ${boldElement('UNBLOCKED', 'olive')}`;
  } else if (_.get(onlyChange, 'state') === 'done') {
    return `Task ${boldElement(original.name)} has been marked as ${boldElement('DONE', 'green')}`;
  }
};

const getCommentChangeMessage = (
  projects,
  projectName,
  onlyChange,
  original
) => {
  userNotifyService.excludeUserFromNotification(
    _.get(onlyChange, 'user.email')
  );
  return `User ${boldElement(onlyChange.user.displayName)}  ${boldElement('commented')} task ${boldElement(original.name)} ${quotedElement(onlyChange.comment)}`;
};

const boldElement = (showValue, color = 'snow') => {
  return `<b style="color:${color}; font-size:22px; font-weight:bold">${showValue}</b>`;
};

const quotedElement = value => {
  return `<br /><blockquote style="border-left: 5px solid gray; padding-left: 10px;">
    <cite>${value}</cite>
  </blockquote>`;
};

module.exports = {
  formatChangeMessage
};
