module.exports = (body, routePath, sendType) => {
  const api_key = 'key-1eb538a9d407e6d3428810f44b00148f';
  const domain = 'sandboxb039ada4143d4f6bad5c2e4212198e5a.mailgun.org';
  const mailgun = require('mailgun-js')({apiKey: api_key, domain: domain});

  const data = {
    from: 'Decision Maker <me@samples.mailgun.org>',
    to: '',
    subject: 'Default subject',
    text: ''
  };

  if (sendType === 'createPoll') {
    data.text = `Thank you for submitting the poll: ${body.title}\n
                http://localhost:8080/${routePath} - Used for voting on your poll\n
                http://localhost:8080/${routePath}/results - View results here`;

    data.subject = `Your new poll: ${body.title}`;

  } else {
    data.text = `You received a vote submission on poll: ${body.poll_title}\n
                Please visit http://localhost:8080/${routePath}/results to view the current results`;

    data.subject = `Your Poll '${body.poll_title}' Has Been Voted On`;
  }

  data.to = `${body.email}`;

  //SEND THE MESSAGE
  mailgun.messages().send(data, function (error, body) {
    if (error) {
      console.log('Error:', error);
    }
  });

};
