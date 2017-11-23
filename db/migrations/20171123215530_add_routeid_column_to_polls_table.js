exports.up = function(knex, Promise) {
  return knex.schema.table('polls', function (table) {
    table.string('routePath');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.table('polls', function (table) {
    table.dropColumn('routePath');
  });
};
