exports.up = function(knex, Promise) {
  return knex.schema.createTable('ratings', function (table) {
    table.increments('id').primary();
    table.integer('rating');
    table.integer('option_id').references('id').inTable('options');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('ratings');
};
