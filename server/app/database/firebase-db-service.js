const fb = require('../configs/firebase');

const _ = require('lodash');
var deepDiff = require('deep-diff');

const logService = require('../services/log-service');
const utilsService = require('../services/utils-service');

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
    let change = utilsService.difference(newDbState, projects);
    console.log(JSON.stringify(change, null, 2));
    console.log(utilsService.getOriginalTask(projects, change));
  }
};

module.exports = {
  connectToDatabase
};
