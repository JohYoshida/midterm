"use strict";

require('dotenv').config();

const PORT        = process.env.PORT || 8080;
const ENV         = process.env.ENV || "development";
const express     = require("express");
const bodyParser  = require("body-parser");
const sass        = require("node-sass-middleware");
const app         = express();

const knexConfig  = require("./knexfile");
const knex        = require("knex")(knexConfig[ENV]);
const morgan      = require('morgan');
const knexLogger  = require('knex-logger');
const mailgun     = require('./mailgun');


const helpers = require('./public/scripts/helpers.js');


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

  const generatedNum = helpers.generateRandomChars('0123456789abcdefghijklmnopqrstuvwxyz', 6);

   mailgun(req.body, generatedNum, "createPoll");

  knex('polls')
    .insert({
      poll_title: req.body.title,
      email: req.body.email,
      routePath: generatedNum
    })
    .returning('*')
    .then((polls) => {
      const optionArray = req.body.option;
      let i = 0;

      optionArray.forEach(value => {
        knex('options')
          .select('*')
          .returning('*')
          .then((option) => {
            console.log('Option:', value, "Description:", req.body.description[i]);

            if (value !== '' ){
              knex('options')
                .insert({
                  option_title: value,
                  description: req.body.description[i],
                  poll_id: polls[0].id
                })
                .then();
              i++;
            }
          });
      });
    })
    .then(() => {
      // console.log(printAll('options'));
      //sconsole.log(printAll('polls'));
    });



  let responseObject = {pollRoutePath: generatedNum};
  let data = JSON.stringify(responseObject);
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
app.get("/:id", (req, res) => {
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

  knex('polls')
    .where({ routePath: pollId})
    .select('*')
    .then(polls => {
      knex('options')
        .where({ poll_id: polls[0].id })
        .select('*')
        .returning('*')
        .then((options) => {
          for (let option in options) {
            console.log("body", req.body);
            console.log("option", options[option]);
            console.log(options[option].option_title, 'ID:', options[option].id, 'Score:', req.body[options[option].option_title]);
            knex("ratings")
              // .where({ option_id: options[option].id })
              .insert({
                rating: req.body[options[option].option_title] -1,
                option_id: options[option].id
              })
              .then();
          }
        });
    });
  res.status(200).send();
});

// Poll results page
app.get("/:id/results", (req, res) => {
  let pollId = req.params.id;
  let templateVars = {templates: ["oh"]};

  knex('ratings')
    .join('options', 'options.id', 'ratings.option_id')
    .join('polls', 'polls.id', 'options.poll_id')
    .where({ routePath: pollId })
    .then((ratings) => {
      // console.log(ratings);
      ratings.forEach(template => {
        // console.log("Template:", template);

        let isInTemplateVars = false;
        let i = 0;
        for (let option in templateVars.templates) {
          console.log("Option:", option);
          if (template.option_id === templateVars.templates[option].optionId) {
            isInTemplateVars = true;
            i = option;
          }
        }
        if (isInTemplateVars) {
          console.log("Match with", i);
          templateVars.templates[i].rating.push(template.rating);
          console.log(templateVars.templates);
        } else {
          console.log("New");
          templateVars.templates.push({
            optionId: template.option_id,
            rating: [template.rating],
            option_title: template.option_title,
            desc: template.description
          });
          console.log(templateVars.templates);
        }
        console.log("---");
      });
      console.log("Options:", templateVars.templates);
      let removeFirst = templateVars.templates.shift();
      console.log("Spliced options:", templateVars.templates);



      res.render('results', templateVars);
    });

  // knex('polls')
  //   .where({ routePath: pollId })
  //   .select('*')
  //   .returning('*')
  //   .then(polls => {
  //     console.log("Polls:", polls);
  //     knex('options')
  //       .where({ poll_id: polls[0].id })
  //       .select('*')
  //       .returning('*')
  //       .then(options => {
  //         for (let option in options) {
  //           console.log("Option:", option, options[option]);
  //           knex('ratings')
  //           .where({ option_id: options[option].id})
  //           .select('*')
  //           .returning('*')
  //           .then(ratings => {
  //             console.log("Ratings:", ratings);
  //             templateVars[`option${option}`] = {
  //               option_id: options[option].id,
  //               scores: []
  //             };
  //             ratings.forEach(rating => {
  //               templateVars[`option${option}`].scores.push(rating.rating);
  //             });
  //           })
  //           .then(() => {
  //             console.log("Template:", templateVars);
  //             res.render('results', templateVars);
  //           });
  //         }
  //       })
  //       .then(() => {
  //         // res.render('results', templateVars);
  //       });
  //   });
});

app.listen(PORT, () => {
  console.log("Example app listening on port " + PORT);
});
