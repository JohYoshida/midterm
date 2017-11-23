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

// Home page
app.get("/", (req, res) => {
  res.render("index");
});

// main page POST
app.post("/", (req, res) => {
//fill me with javascript please for when the creator submits the initial form
  console.log(req.body);
  // knex('polls')
  //   .insert({
  //     title: req.body.title,
  //     email: req.body.email
  //   })
  //   .asCallback(function(err, result) {
  //     if (err) return console.error(err);
  //     console.log(printAll());
  //   });
});

//used for testing
function printAll(){
  knex.select('*')
    .from('polls')
    .asCallback(function(err, rows) {
      console.log(rows);
    })
}


// Poll page
app.get("/poll", (req, res) => {
  res.render("poll");
});

// poll page POST
app.post("/poll", (req, res) => {
//fill me with javascript please for when the user submits poll rankins
});

// Poll results page
app.get("/poll/results", (req, res) => {
  res.render("results");
});

app.listen(PORT, () => {
  console.log("Example app listening on port " + PORT);
});
