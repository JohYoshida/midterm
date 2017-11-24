require('dotenv').config();

const ENV         = process.env.ENV || "development";
const knexConfig  = require("../knexfile");
const knex        = require("knex")(knexConfig[ENV]);

module.exports = {
  generateRandomChars: function (chars, length) {
    let result = '';
    for (let i = length; i > 0; --i) {
      result += chars[Math.floor(Math.random() * chars.length)];
    }
    return result;
  },

//to use this go let route_path = checkForDupe(generateRandomChars('0123456789abcdefghijklmnopqrstuvwxyz', 6));
// the route_path variable now has the unique routePath to be placed in the polls table
  checkForDupe: function (path) {
    const charsForPath = '0123456789abcdefghijklmnopqrstuvwxyz';

    knex('polls')
      .returning('*')
      .then((polls) => {
        for (let n = 0; n < polls.length; n++){
          //console.log(n);
          if (polls[n].routePath === path) {
            console.log('we have a dupe');
            return checkForDupe(generateRandomChars(charsForPath, 6));
          }
        };
        //console.log('inside checkForDupe: ', path);
        return path;
      });
  }
};
