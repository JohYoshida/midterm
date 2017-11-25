exports.up = function(knex, Promise) {
  return knex.schema.table('options', function (table) {
    table.renameColumn('options_title', 'option_title');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.table('options', function (table) {
    table.renameColumn('option_title', 'options_title');
  });
};

