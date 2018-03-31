const _ = require('lodash');

let userToExcludeFromNotification = [];

const getListOfUserToNotify = originalTask => {
  let usersToNotify = ['ivanastean@gmail.com'];
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

  usersToNotify = _.filter(
    _.uniq(usersToNotify),
    email =>
      !_.isNil(email) &&
      !_.isEmpty(email) &&
      userToExcludeFromNotification.indexOf(email) === -1
  );

  userToExcludeFromNotification = [];

  return usersToNotify;
};

const excludeUserFromNotification = user => {
  userToExcludeFromNotification.push(user);
};

module.exports = {
  getListOfUserToNotify,
  excludeUserFromNotification
};
