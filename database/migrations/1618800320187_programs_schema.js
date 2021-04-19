"use strict";

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use("Schema");

class ProgramsSchema extends Schema {
  up() {
    this.create("programs", (table) => {
      table.increments();
      table.string("name", 254).notNullable();
      table.text("description").nullable();
      table.timestamps();
      table.timestamp("deleted_at", { precision: 6 }).nullable();
    });
  }

  down() {
    this.drop("programs");
  }
}

module.exports = ProgramsSchema;
