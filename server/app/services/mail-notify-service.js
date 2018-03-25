var mailgun = require('mailgun-js');
var api_key = 'pubkey-0124d12bc05a2ee8c72a690bfc2ae5f6';
var DOMAIN = 'sandbox8e5f912224c94f5db29f7d41fd8742ba.mailgun.org';
var mailgun = require('mailgun-js')({ apiKey: api_key, domain: DOMAIN });

var data = {
  from: 'Excited User <me@samples.mailgun.org>',
  to: 'rashastev@gmail.com',
  subject: 'Hello',
  text: 'Testing some Mailgun awesomness!'
};

const sendMessage = () => {
  mailgun.messages().send(data, function(error, body) {
    console.log(body);
  });
};
