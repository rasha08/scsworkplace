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
    console.log(JSON.stringify(change, null, 2));
    let originalTask = taskChangeService.getOriginalTask(projects, change);
    // mailNotifyService.sendMessage();
    let usersToNotify = taskChangeService.getListOfUserToNotify(originalTask);
    mailNotifyService.formatDataAndSendMessage(createChangeObject(change, originalTask, usersToNotify));
  }
};

const createChangeObject = (change, orgiginalTask, usersToNotify) => {
  return {
    projectName: _.findKey(change),
    taskName: orgiginalTask.name,
    changeMessage: 'Ovo je test poruka samo pokusavam da smislim kako ce izgledati kartice za email notifikacije',
    usersToNotify: usersToNotify
  }
}

module.exports = {
  connectToDatabase
};
