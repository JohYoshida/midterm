// var api_key = 'key-1eb538a9d407e6d3428810f44b00148f';
// var domain = 'sandboxb039ada4143d4f6bad5c2e4212198e5a.mailgun.org';
// var mailgun = require('mailgun-js')({apiKey: api_key, domain: domain});

// var data = {
//   from: 'Excited User <me@samples.mailgun.org>',
//   to: 'johyoshida@gmail.com',
//   subject: 'Hello',
//   text: 'Testing some Mailgun awesomness!'
// };

// mailgun.messages().send(data, function (error, body) {
//   console.log(body);
// });


module.exports = function (body, routePath) {
  var api_key = 'key-1eb538a9d407e6d3428810f44b00148f';
  var domain = 'sandboxb039ada4143d4f6bad5c2e4212198e5a.mailgun.org';
  var mailgun = require('mailgun-js')({apiKey: api_key, domain: domain});

  var data = {
    from: 'Decision Maker <me@samples.mailgun.org>',
    to: '',
    subject: 'Default subject',
    text: ''
  };

  //console.log('body ====>' + body + 'routePath ====>' + routePath);
  /*
  { title: 'cu',
  email: 'agisoluk@host.local',
  option: [ 'epref', 'oh' ],
  description: [ 'pocahtod', 'zuwov' ] }
   */
  data.text = `Thank you for submitting the poll: ${body.title}\n
                http://localhost:8080/${routePath} - Used for voting on your poll\n
                http://localhost:8080/${routePath}/results - View results here`

  data.to = `${body.email}`

  data.subject = `Your new poll: ${body.title}`
  console.log('data test ====>   \n', data);

  //SEND THE MESSAGE
  mailgun.messages().send(data, function (error, body) {
    console.log(body);
  });

};
