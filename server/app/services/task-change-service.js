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

const createChangeObject = (change, orgiginalTask, usersToNotify, projects) => {
  const message = formatChangeMessageService.formatChangeMessage(
    change,
    orgiginalTask,
    projects
  );

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
  createChangeObject
};
