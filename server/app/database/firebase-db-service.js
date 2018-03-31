const _ = require('lodash');

const fb = require('../configs/firebase');
const logService = require('../services/log-service');
const taskChangeService = require('../services/task-change-service');
const mailNotifyService = require('../services/mail-notify-service');
const userNotifyService = require('../services/user-notify-service');

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
    let usersToNotify = [];

    let changeObject = taskChangeService.createChangeObject(
      change,
      originalTask,
      usersToNotify,
      projects
    );

    changeObject.usersToNotify = userNotifyService.getListOfUserToNotify(
      originalTask
    );

    mailNotifyService.formatDataAndSendMessage(changeObject);
  }
};

module.exports = {
  connectToDatabase
};
