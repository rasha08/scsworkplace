const _ = require('lodash');

const fb = require('../configs/firebase');
const logService = require('../services/log-service');
const taskChangeService = require('../services/task-change-service');
const mailNotifyService = require('../services/mail-notify-service');

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
    let originalTask = taskChangeService.getOriginalTask(projects, change);
    let usersToNotify = taskChangeService.getListOfUserToNotify(originalTask);
    mailNotifyService.formatDataAndSendMessage(
      taskChangeService.createChangeObject(
        change,
        originalTask,
        usersToNotify,
        projects
      )
    );
  }
};

module.exports = {
  connectToDatabase
};
