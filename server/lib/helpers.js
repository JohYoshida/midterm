require('dotenv').config();

const ENV         = process.env.ENV || 'development';
const knexConfig  = require('../knexfile');
const knex        = require('knex')(knexConfig[ENV]);

module.exports = {
  generateRandomChars: (chars, length) => {
    let result = '';
    for (let i = length; i > 0; --i) {
      result += chars[Math.floor(Math.random() * chars.length)];
    }
    return result;
  },

  //to use this go let route_path = checkForDupe(generateRandomChars('0123456789abcdefghijklmnopqrstuvwxyz', 6));
  // the route_path variable now has the unique routePath to be placed in the polls table
  checkForDupe: path => {
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
        }
        //console.log('inside checkForDupe: ', path);
        return path;
      });
  },

  insertIntoTables: (body, id) => {
    knex('polls')
      .insert({
        title: body.title,
        email: body.email,
        routePath: id
      })
      .returning('*')
      .then((polls) => {
        const optionsArray = body.option;
        let i = 0;

        optionsArray.forEach(value => {
          knex('options')
            .select('*')
            .returning('*')
            .then(option => {
              console.log('*****option!!!!!:   ', value);
              if (value !== ''){
                //console.log('COUNT IT');
                knex('options')
                  .insert({
                    title: value,
                    description: body.description[i],
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
        // console.log(printAll('polls'));
      });
  }
};
