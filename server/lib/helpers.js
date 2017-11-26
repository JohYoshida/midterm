require('dotenv').config();

const ENV         = process.env.ENV || 'development';
const knexConfig  = require('../../knexfile');
const knex        = require('knex')(knexConfig[ENV]);

const insertIntoPollsTable = (body, pollId) => {
  return knex('polls')
    .insert({
      poll_title: body.title,
      email: body.email,
      routePath: pollId
    })
    .returning('*');
};

const insertIntoOptionsTable = (title, description, poll) => {
  return knex('options')
    .insert({
      option_title: title,
      description: description,
      poll_id: poll.id
    });
};

const insertIntoRatingsTable = (body, option) => {
  return knex('ratings')
    .insert({
      rating: body[option.option_title],
      option_id: option.id
    });
};

const fetchPolls = () => {
  return knex('polls').returning('*');
};

const fetchOptions = () => {
  return knex('options')
    .select('*')
    .returning('*');
};

const fetchRatingsAtPollId = (id) => {
  return knex('ratings')
    .join('options', 'options.id', 'ratings.option_id')
    .join('polls', 'polls.id', 'options.poll_id')
    .where({ routePath: id });
};

const fetchPollAtRoutePath = (id) => {
  return knex('polls')
    .where({ routePath: id})
    .select('*')
    .returning('*');
};

const fetchOptionsAtPollId = (poll) => {
  return knex('options')
    .where({ poll_id: poll.id })
    .select('*')
    .returning('*');
};

const generateRandomChars = (chars, length) => {
  let result = '';
  for (let i = length; i > 0; --i) {
    result += chars[Math.floor(Math.random() * chars.length)];
  }
  return result;
};

const checkForDupe = (path) => {
  const charsForPath = '0123456789abcdefghijklmnopqrstuvwxyz';

  return fetchPolls()
    .then((polls) => {
      for (let n = 0; n < polls.length; n++){
        if (polls[n].routePath === path) {
          return checkForDupe(generateRandomChars(charsForPath, 6));
        }
      }
      return path;
    });
};

module.exports = {
  generateRandomChars,
  fetchPolls,
  fetchOptions,
  fetchPollAtRoutePath,
  fetchOptionsAtPollId,
  fetchRatingsAtPollId,
  insertIntoPollsTable,
  insertIntoOptionsTable,
  insertIntoRatingsTable
};
