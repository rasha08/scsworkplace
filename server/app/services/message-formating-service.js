const _ = require('lodash');

const formatChangeMessage = (change, original, projects) => {
  const projectName = _.findKey(change);
  const taskNameSlug = _.findKey(_.get(change[_.findKey(change)], 'tasks'));
  const onlyChange = _.get(change, `${projectName}.tasks.${taskNameSlug}`);

  if (_.has(onlyChange, 'columnIndex')) {
    return getColumnChangeIndexMessage(
      projects,
      projectName,
      onlyChange,
      original
    );
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
  return `Task <b style="color:snow">${original.name}</b> has been moved from <b style="color:snow">${formatMessageProperty(projects, projectName, onlyChange)}</b> to <b style="color:snow">${formatMessageProperty(projects, projectName, original)}</b>`;
};

module.exports = {
  formatChangeMessage
};
