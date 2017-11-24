var api_key = 'key-1eb538a9d407e6d3428810f44b00148f';
var domain = 'sandboxb039ada4143d4f6bad5c2e4212198e5a.mailgun.org';
var mailgun = require('mailgun-js')({apiKey: api_key, domain: domain});

var data = {
  from: 'Excited User <me@samples.mailgun.org>',
  to: 'johyoshida@gmail.com',
  subject: 'Hello',
  text: 'Testing some Mailgun awesomness!'
};

mailgun.messages().send(data, function (error, body) {
  console.log(body);
});
