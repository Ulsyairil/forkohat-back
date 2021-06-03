'use strict';

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema');

class OrdersSchema extends Schema {
  up() {
    this.create('orders', (table) => {
      table.engine('InnoDB');
      table.bigIncrements();
      table
        .bigInteger('program_id')
        .notNullable()
        .unsigned()
        .references('id')
        .inTable('programs')
        .onDelete('cascade');
      table.string('name', 254).notNullable();
      table.text('description').nullable();
      table.timestamps();
      table.timestamp('deleted_at', { precision: 6 }).nullable();
    });
  }

  down() {
    this.drop('orders');
  }
}

module.exports = OrdersSchema;
