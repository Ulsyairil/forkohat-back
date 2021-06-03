'use strict';

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema');

class ProgramRuledSchema extends Schema {
  up() {
    this.create('program_ruled', (table) => {
      table.engine('InnoDB');
      table.bigIncrements();
      table
        .bigInteger('rule_id')
        .notNullable()
        .unsigned()
        .references('id')
        .inTable('rules')
        .onDelete('cascade');
      table
        .bigInteger('program_id')
        .notNullable()
        .unsigned()
        .references('id')
        .inTable('programs')
        .onDelete('cascade');
      table.timestamps();
    });
  }

  down() {
    this.drop('program_ruled');
  }
}

module.exports = ProgramRuledSchema;
