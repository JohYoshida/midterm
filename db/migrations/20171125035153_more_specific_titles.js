exports.up = function(knex, Promise) {
  return knex.schema.table('polls', function (table) {
    table.dropColumn('title');
    table.string('poll_title');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.table('polls', function (table) {
    table.string('title');
    table.dropColumn('poll_title');
  });
};
