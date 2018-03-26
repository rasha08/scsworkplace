const _ = require('lodash');
const formatChangeMessageService = require('./message-formating-service');

const difference = (object, base) => {
  return getDifference(object, base);
};

const getDifference = (object, base) => {
  return _.transform(object, (result, value, key) => {
    if (!_.isEqual(value, base[key])) {
      result[key] = _.isObject(value) && _.isObject(base[key])
        ? getDifference(value, base[key])
        : value;
    }
  });
};

const getChangedTaskEntities = changedTask => {
  return {
    project: _.findKey(changedTask),
    taskId: _.findKey(_.get(changedTask[_.findKey(changedTask)], 'tasks'))
  };
};

const getOriginalTask = (allProjects, changedTask) => {
  const changedTaskEntities = getChangedTaskEntities(changedTask);
  if (isExistingTask(allProjects, changedTaskEntities)) {
    return getTaskFromProjects(allProjects, changedTaskEntities);
  }

  return changedTask;
};

const isExistingTask = (allProjects, taskEntities) => {
  return !_.isNil(getTaskFromProjects(allProjects, taskEntities));
};

const getTaskFromProjects = (allProjects, taskEntities) => {
  return _.get(
    allProjects,
    `${taskEntities.project}.tasks.${taskEntities.taskId}`
  );
};

const getListOfUserToNotify = originalTask => {
  const usersToNotify = [];
  usersToNotify.push(_.get(originalTask, 'createdBy'));

  if (_.get(originalTask, 'assigner')) {
    usersToNotify.push(_.get(originalTask, 'assigner.email'));
  }

  if (_.get(originalTask, 'reviewer')) {
    usersToNotify.push(_.get(originalTask, 'reviewer.email'));
  }

  if (!_.isEmpty(_.get(originalTask, 'comments'))) {
    _.forEach(_.get(originalTask, 'comments'), comment => {
      usersToNotify.push(_.get(comment, 'user.email'));
    });
  }

  return _.filter(
    _.uniq(usersToNotify),
    email => !_.isNil(email) && !_.isEmpty(email)
  );
};

const createChangeObject = (change, orgiginalTask, usersToNotify, projects) => {
  const message = formatChangeMessageService.formatChangeMessage(
    change,
    orgiginalTask,
    projects
  );
  console.log(message);
  return {
    projectName: _.findKey(change),
    taskName: orgiginalTask.name,
    changeMessage: message,
    usersToNotify: usersToNotify
  };
};

module.exports = {
  difference,
  getOriginalTask,
  getListOfUserToNotify,
  createChangeObject
};
