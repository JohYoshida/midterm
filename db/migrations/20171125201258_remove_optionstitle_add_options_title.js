exports.up = function(knex, Promise) {
  return knex.schema.table('options', function (table) {
    table.dropColumn('title');
    table.string('options_title');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.table('options', function (table) {
    table.string('title');
    table.dropColumn('options_title');
  });
};
