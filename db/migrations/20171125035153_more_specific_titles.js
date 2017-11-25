exports.up = function(knex, Promise) {
  return knex.schema.table('polls', function (table) {
    // table.dropColumn('title');
    table.string('poll_title');
  });
  return knex.schema.table('options', function (table) {
    table.dropColumn('title');
    table.string('option_title');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.table('polls', function (table) {
    table.dropColumn('poll_title');
  });
  return knex.schema.table('options', function (table) {
    table.dropColumn('option_title');
  });
};
