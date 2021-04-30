'use strict';

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema');

class NewsSchema extends Schema {
  up() {
    this.create('news', (table) => {
      table.engine('InnoDB');
      table.bigIncrements();
      table
        .bigInteger('author_id')
        .notNullable()
        .unsigned()
        .references('id')
        .inTable('users')
        .onDelete('cascade');
      table.string('title', 254).notNullable();
      table.text('content').notNullable();
      table.date('date').notNullable();
      table.timestamps();
      table.timestamp('deleted_at', { precision: 6 }).nullable();
    });
  }

  down() {
    this.drop('news');
  }
}

module.exports = NewsSchema;
