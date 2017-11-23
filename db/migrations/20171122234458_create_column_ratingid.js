exports.up = function(knex, Promise) {
  return knex.schema.table('options', function (table) {
    table.integer('rating_id').references('id').inTable('ratings');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.table('options', function (table) {
    table.dropColumn('rating_id');
  });
};
