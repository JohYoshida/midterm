
exports.up = function(knex, Promise) {

  return Promise.all([

    knex.schema.createTable('polls', function (table) {
      table.increments('id').primary();
      table.string('title');
      table.string('email');
    }),

    knex.schema.createTable('options', function (table) {
        table.increments('id').primary();
        table.string('title');
        table.text('description');
        table.integer('poll_id').references('id').inTable('polls');
        table.integer('score');
      })
  ]);

};

exports.down = function(knex, Promise) {

  return Promise.all([

    knex.schema.dropTable('polls'),
    knex.schema.dropTable('options')
  ]);
};
