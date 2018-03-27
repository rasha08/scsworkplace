const logService = require('./log-service');

const api_key = 'key-646af459e2bee923e52500a9f96c0b8a';
const DOMAIN = 'sandbox8e5f912224c94f5db29f7d41fd8742ba.mailgun.org';
const mailgun = require('mailgun-js')({ apiKey: api_key, domain: DOMAIN });

const sendMessage = data => {
  mailgun.messages().send(data, function(error, body) {
    if (error) {
      // logService.error('error while sending email notification');
      console.log(error);
      return;
    }

    logService.log('email notifications sent');
  });
};

const formatDataAndSendMessage = changeObject => {
  if (!changeObject.changeMessage) {
    return;
  }

  const data = {
    from: 'SCS WORKPLACE <me@samples.mailgun.org>',
    // to: changeObject.usersToNotify.reduce((prev, curr) => prev + ',' + curr),
    to: 'rasha08@gmail.com',
    subject: `${changeObject.projectName.toUpperCase()} - ${changeObject.taskName}`,
    html: `
      <html style="overflow:hidden">
        <head>
          <title>${changeObject.projectName}</title>
          <style type="text/css">
            * {
                overflow:hidden;
            }
          </style>
        </head>
        <body style="overflow:hidden">
          <div style=" overflow-y:hidden; border: 2px solid firebrick; border-top-left-radius: 10px; border-top-right-radius: 10px; box-shadow: 2px 3px 5px 4px gray; width: 500px;  background-color: #484E53;">
            <div style="width: 480px; min-height: 50px; background-color: #2b2f33; color:snow; font-size: 24px; text-align: center; padding-right:25%; padding:3%; box-shadow: inset 1px 1px 1px gray; font-weight: bold; overflow-y:hidden">
              ${changeObject.taskName}
            </div>
            <div style="width: 380px; height: 150px; background-color: #484E53; color:papayawhip; font-size: 16px; text-align: center; border-bottom: 1px solid firebrick; border-top: 1px solid firebrick; overflow:hidden; padding-top: 10%; padding-left: 10%; padding-right:25%">
              ${changeObject.changeMessage}
            </div>
            <div style="width: 520px; height: 20px; background-color: #2b2f33; color:snow; font-size: 14px; text-align: center; padding:1%; box-shadow: inset 1px 1px 1px gray; overflow:hidden">
              developed by <a href="http://smart-cat-solutions.com">smart cat solutions</a>
            </div>
          </div>
        </body>
      </html>
    `
  };

  sendMessage(data);
};

module.exports = {
  formatDataAndSendMessage
};
