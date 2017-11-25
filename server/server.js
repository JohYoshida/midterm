"use strict";

require('dotenv').config();

const PORT        = process.env.PORT || 8080;
const ENV         = process.env.ENV || "development";
const express     = require("express");
const bodyParser  = require("body-parser");
const sass        = require("node-sass-middleware");
const app         = express();

const knexConfig  = require("../knexfile");
const knex        = require("knex")(knexConfig[ENV]);
const morgan      = require('morgan');
const knexLogger  = require('knex-logger');
const mailgun     = require('./mailgun');


const helpers = require('./lib/helpers.js');


// Load the logger first so all (static) HTTP requests are logged to STDOUT
// 'dev' = Concise output colored by response status for development use.
//         The :status token will be colored red for server error codes, yellow for client error codes, cyan for redirection codes, and uncolored for all other codes.
app.use(morgan('dev'));

// Log knex SQL queries to STDOUT as well
app.use(knexLogger(knex));

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/styles", sass({
  src: __dirname + "/styles",
  dest: __dirname + "/public/styles",
  debug: true,
  outputStyle: 'expanded'
}));
app.use(express.static("public"));

// handle favicon weirdness
app.get('/favicon.ico', (req, res) => {
  res.status(204);
});

// Home page
app.get("/", (req, res) => {
  res.render("index");
});

// main page POST
app.post("/", (req, res) => {
// testing routePaths
  //const route_path_not_dupe = helpers.checkForDupe(generatedNum);     WILL WORK ON THIS LATER
  //console.log('checking route_path_not_dupe: ', route_path_not_dupe);

  //fill me with javascript please for when the creator submits the initial form
  const generatedNum = helpers.generateRandomChars('0123456789abcdefghijklmnopqrstuvwxyz', 6);

  helpers.insertIntoPollsTable(req.body, generatedNum)
    .then((polls) => {
      const optionArray = req.body.option;
      let i = 0;

      optionArray.forEach(value => {
        helpers.fetchOptions()
          .then((option) => {
            console.log('Option:', value, "Description:", req.body.description[i]);

            if (value !== '' ){
              helpers.insertIntoOptionsTable(value, req.body.description[i], polls[0])
                .then();
              i++;
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
app.get("/:id", (req, res) => {
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
          res.render("poll", templateVars);
        });
    });
});

// poll page POST
app.post("/:id", (req, res) => {
  //fill me with javascript please for when the user submits poll rankins
  let pollId = req.headers.referer.slice(-6);
  helpers.fetchPollAtRoutePath(pollId)
    .then(polls => {
      helpers.fetchOptionsAtPollId(polls[0])
        .then((options) => {
          for (let option in options) {
            console.log("Title", options[option].option_title, 'ID:', options[option].id, 'Score:', req.body[options[option].option_title]);
            helpers.insertIntoRatingsTable(req.body, options[option])
              .then();
          }
        });
    });
  res.status(200).send();
});

// Poll results page
app.get("/:id/results", (req, res) => {
  let pollId = req.params.id;
  // templateVars.options array needs to have something in it to work
  // This placeholder is removed further down
  let templateVars = {options: ["oh"]};

  knex('ratings')
    .join('options', 'options.id', 'ratings.option_id')
    .join('polls', 'polls.id', 'options.poll_id')
    .where({ routePath: pollId })
    // helpers.fetchRatingsAtPollId(pollId)
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
          templateVars.options[i].totalScore += result.rating
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
        console.log(templateVars.options[i].rating);
      });
      // Remove placeholder
      let removeFirst = templateVars.options.shift();
      console.log("Options:", templateVars);
      res.render('results', templateVars);
    });
});

app.listen(PORT, () => {
  console.log("Example app listening on port " + PORT);
});
