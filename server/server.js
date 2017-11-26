'use strict';

require('dotenv').config();

const PORT        = process.env.PORT || 8080;
const ENV         = process.env.ENV || 'development';
const express     = require('express');
const bodyParser  = require('body-parser');
const sass        = require('node-sass-middleware');
const app         = express();

const knexConfig  = require('../knexfile');
const knex        = require('knex')(knexConfig[ENV]);
const morgan      = require('morgan');
const knexLogger  = require('knex-logger');
const mailgun     = require('../mailgun');

const helpers = require('./lib/helpers.js');

// Load the logger first so all (static) HTTP requests are logged to STDOUT
// 'dev' = Concise output colored by response status for development use.
//         The :status token will be colored red for server error codes, yellow for client error codes, cyan for redirection codes, and uncolored for all other codes.
app.use(morgan('dev'));

// Log knex SQL queries to STDOUT as well
app.use(knexLogger(knex));

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/styles', sass({
  src: './styles',
  dest: './public/styles',
  debug: true,
  outputStyle: 'expanded'
}));
<<<<<<< HEAD

app.use(express.static("public"));
=======
console.log(__dirname);
app.use(express.static('public'));
>>>>>>> dev

// handle favicon weirdness
app.get('/favicon.ico', (req, res) => {
  res.status(204);
});

// Home page
app.get('/', (req, res) => {
  res.render('index');
});

// main page POST
<<<<<<< HEAD
app.post("/", (req, res) => {
=======
app.post('/', (req, res) => {
>>>>>>> dev
  const generatedNum = helpers.generateRandomChars('0123456789abcdefghijklmnopqrstuvwxyz', 6);
  //gives us access to the polls table
  helpers.insertIntoPollsTable(req.body, generatedNum)
    .then((polls) => {
      const optionArray = req.body.option;
      const descriptionArray = req.body.description;
<<<<<<< HEAD
      //for each option if it has a value add the option & it's description to database
      optionArray.forEach((value,index) => {
        helpers.fetchOptions()
          .then((option) => {
=======

      optionArray.forEach((value, index) => {
        helpers.fetchOptions()
          .then((option) => {
            console.log('Option:', value, 'Description:', descriptionArray[index]);

>>>>>>> dev
            if (value !== '' ){
              helpers.insertIntoOptionsTable(value, descriptionArray[index], polls[0])
                .then();
            }
          });
      });
    })
    .then();

  let responseObject = {pollRoutePath: generatedNum};
  let data = JSON.stringify(responseObject);
  res.send(data);
});

// Poll page
app.get('/:id', (req, res) => {
  let tempId = req.params.id;
  helpers.fetchPollAtRoutePath(tempId)
    .then((polls) => {
      helpers.fetchOptionsAtPollId(polls[0])
        .then((options) => {
          let templateVars = {
            id: tempId,
            pollTitle: polls[0].poll_title,
            pollEmail: polls[0].email,
            pollRoutePath: polls[0].routePath,
            optionsArr: options
          };
          res.render('poll', templateVars);
        });
    });
});

// poll page POST
<<<<<<< HEAD
app.post("/:id", (req, res) => {
=======
app.post('/:id', (req, res) => {
  //fill me with javascript please for when the user submits poll rankins
>>>>>>> dev
  let pollId = req.headers.referer.slice(-6);

  helpers.fetchPollAtRoutePath(pollId)
    .then(polls => {
      helpers.fetchOptionsAtPollId(polls[0])
        .then((options) => {
          for (let option in options) {
<<<<<<< HEAD
=======
            console.log('Title', options[option].option_title, 'ID:', options[option].id, 'Score:', req.body[options[option].option_title]);
>>>>>>> dev
            helpers.insertIntoRatingsTable(req.body, options[option])
              .then();
          }
        });
    });
  res.status(200).send();
});

// Poll results page
app.get('/:id/results', (req, res) => {
  let pollId = req.params.id;
  // templateVars.options array needs to have something in it to work
  // This placeholder is removed further down
  let templateVars = {
    options: ['oh'],
    pollTitle: '',
    poll_id: pollId
  };

  knex('ratings')
    .join('options', 'options.id', 'ratings.option_id')
    .join('polls', 'polls.id', 'options.poll_id')
    .where({ routePath: pollId })
    .then((queryResults) => {
      queryResults.forEach(result => {
        // add poll_title and email to templateVars
        templateVars.pollTitle = result.poll_title;
        templateVars.email = result.email;

        let isInTemplateVars = false;
        let i = 0;
        // check if option has already been added to options array
        for (let option in templateVars.options) {
          if (result.option_id === templateVars.options[option].optionId) {
            isInTemplateVars = true;
            i = option;
          }
        }
        if (isInTemplateVars) {
          // add result rating to option
          templateVars.options[i].ratings.push(result.rating);
          templateVars.options[i].totalScore += result.rating;
        } else {
          // add option to options array
          templateVars.options.push({
            optionId: result.option_id,
            ratings: [result.rating],
            totalScore: result.rating,
            option_title: result.option_title,
            desc: result.description
          });
        }
      });
      // Remove placeholder
      let removeFirst = templateVars.options.shift();
<<<<<<< HEAD
      templateVars.options.sort(function(a, b){
=======
      //console.log('Options:', templateVars.options);
      templateVars.options.sort((a, b) => {
>>>>>>> dev
        if (a.totalScore < b.totalScore) {
          return 1;
        }
        if (a.totalScore > b.totalScore) {
          return -1;
        }
        return 0;
      });
<<<<<<< HEAD
=======
      //console.log('Options POST SORT:', templateVars.options);
>>>>>>> dev
      res.render('results', templateVars);
    });
});

app.listen(PORT, () => {
  console.log('Example app listening on port ' + PORT);
});
