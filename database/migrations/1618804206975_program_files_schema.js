"use strict";

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use("Schema");

class ProgramFilesSchema extends Schema {
  up() {
    this.create("program_files", (table) => {
      table.increments();
      table
        .integer("program_id")
        .notNullable()
        .unsigned()
        .references("id")
        .inTable("programs")
        .unique();
      table.string("name", 254).notNullable();
      table.string("mime", 5).notNullable();
      table.text("path").notNullable();
      table.text("url").notNullable();
      table.timestamps();
      table.timestamp("deleted_at", { precision: 6 }).nullable();
    });
  }

  down() {
    this.drop("program_files");
  }
}

module.exports = ProgramFilesSchema;
