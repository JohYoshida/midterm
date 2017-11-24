'use strict';

require('dotenv').config();

const PORT        = process.env.PORT || 8080;
const ENV         = process.env.ENV || 'development';
const express     = require('express');
const bodyParser  = require('body-parser');
const sass        = require('node-sass-middleware');
const app         = express();

const knexConfig  = require('./knexfile');
const knex        = require('knex')(knexConfig[ENV]);
const morgan      = require('morgan');
const knexLogger  = require('knex-logger');


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
  src: __dirname + '/styles',
  dest: __dirname + '/public/styles',
  debug: true,
  outputStyle: 'expanded'
}));
app.use(express.static('public'));


// Home page
app.get('/', (req, res) => {
  res.render('index');
});

// main page POST
app.post('/', (req, res) => {
// testing routePaths

  const generatedNum = helpers.generateRandomChars('0123456789abcdefghijklmnopqrstuvwxyz', 6);
  //const route_path_not_dupe = helpers.checkForDupe(generatedNum);     WILL WORK ON THIS LATER
  //console.log('checking route_path_not_dupe: ', route_path_not_dupe);
  //fill me with javascript please for when the creator submits the initial form

  helpers.insertIntoTables(req.body, generatedNum);

  let responseObject = { pollRoutePath: generatedNum };
  let data = JSON.stringify(responseObject);
  console.log(data);
  res.send(data);
});

//used for testing
function printAll(table){
  knex.select('*')
    .from(table)
    .asCallback(function(err, rows) {
      console.log(rows);
    });
}


// Poll page
app.get('/:id', (req, res) => {
  let tempId = req.params.id;
  knex('polls')
    .where({ routePath: tempId})
    .select('*')
    .returning('*')
    .then((polls) => {
      knex('options')
        .where({ poll_id: polls[0].id })
        .select('*')
        .returning('*')
        .then((options) => {

          let templateVars = {
            id: tempId,
            pollTitle: polls[0].title,
            pollEmail: polls[0].email,
            pollRoutePath: polls[0].routePath,
            optionsArr: options
          };
          res.render('poll', templateVars);
        });
    });
});

// poll page POST
app.post('/poll', (req, res) => {
//fill me with javascript please for when the user submits poll rankins
});

// Poll results page
app.get('/poll/results', (req, res) => {
  res.render('results');
});

app.listen(PORT, () => {
  console.log('Example app listening on port ' + PORT);
});
// console.log(helpers.generateRandomChars('0123456789abcdefghijklmnopqrstuvwxyz', 6));
