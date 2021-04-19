"use strict";

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use("Schema");

class ProgramRuledSchema extends Schema {
  up() {
    this.create("program_ruled", (table) => {
      table.increments();
      table
        .integer("rule_id")
        .notNullable()
        .unsigned()
        .references("id")
        .inTable("rules");
      table
        .integer("program_id")
        .notNullable()
        .unsigned()
        .references("id")
        .inTable("programs");
      table.timestamps();
    });
  }

  down() {
    this.drop("program_ruled");
  }
}

module.exports = ProgramRuledSchema;
