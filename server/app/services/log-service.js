const log = message => {
  console.log(
    `*** | ${new Date().toLocaleString()} | ***  ${message.toUpperCase()}  ***`
  );
};

const error = message => {
  console.error(
    `*** | ${new Date().toLocaleString()} | ***  ${message.toUpperCase()}  ***`
  );
};

module.exports = {
  log,
  error
};
