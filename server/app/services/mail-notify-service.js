const logService = require('./log-service');

const api_key = 'key-646af459e2bee923e52500a9f96c0b8a';
const DOMAIN = 'sandbox8e5f912224c94f5db29f7d41fd8742ba.mailgun.org';
const mailgun = require('mailgun-js')({ apiKey: api_key, domain: DOMAIN });

const sendMessage = (data) => {
  mailgun.messages().send(data, function(error, body) {
    if (error) {
      // logService.error('error while sending email notification'); 
      console.log(error)
      return;
    }

    logService.log('email notifications sent');
  });
};

const formatDataAndSendMessage = (changeObject) => {
  const data = {
    from: 'SCS WORKPLACE <me@samples.mailgun.org>',
    to: changeObject.usersToNotify.reduce((prev, curr) => prev + ',' + curr),
    subject: changeObject.projectName,
    text: 'Testing some Mailgun awesomness!',
    html: `
      <html>
        <head>
          <title>${changeObject.projectName}</title>
        </head>
        <body style="width: 500px; height: 350px padding:2%; overflow-y:hidden">
          <div style="border: 2px solid firebrick; border-top-left-radius: 10px; border-top-right-radius: 10px; box-shadow: 2px 3px 5px 4px gray; width: 500px; overflow-y:hidden">
            <div style="width: 100%; height: 50px; background-color: #2b2f33; color:snow; font-size: 24px; text-align: center; padding:3%; box-shadow: inset 1px 1px 1px gray; font-weight: bold; overflow-y:hidden">
              ${changeObject.taskName}
            </div>
            <div style="width: 100%; height: 230px; background-color: #484E53; color:papayawhip; font-size: 20px; text-align: center; padding:3%; border-bottom: 1px solid firebrick; border-top: 1px solid firebrick; overflow-y:hidden">
              ${changeObject.changeMessage}
            </div>
            <div style="width: 100%; height: 20px; background-color: #2b2f33; color:snow; font-size: 14px; text-align: center; padding:1%; box-shadow: inset 1px 1px 1px gray; overflow-y:hidden">
              developed by <a href="http://smart-cat-solutions.com">smart cat solutions</a>
            </div>
          </div>
        </body>
      </html>
    `
  };

  sendMessage(data);
}



module.exports = {
  sendMessage,
  formatDataAndSendMessage
}