const fb = require('../configs/firebase');

const _ = require('lodash');
var deepDiff = require('deep-diff');

const logService = require('../services/log-service');
const taskChangeService = require('../services/task-change-service');

const databaseRef = fb.database.ref('/');
const projects = {};

const connectToDatabase = () => {
  logService.log('connecting to database');

  databaseRef.on('value', snapshot => {
    populateProjects(snapshot.val());
  });
};

const populateProjects = dbProjects => {
  checkForChanges(dbProjects);
  _.merge(projects, dbProjects);
};

const checkForChanges = newDbState => {
  if (!_.isEmpty(projects)) {
    logService.log('processing board state chnage');
    let change = taskChangeService.difference(newDbState, projects);
    console.log(JSON.stringify(change, null, 2));
    let originalTask = taskChangeService.getOriginalTask(projects, change);
    console.log(taskChangeService.getListOfUserToNotify(originalTask));
  }
};

module.exports = {
  connectToDatabase
};
