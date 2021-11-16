"use strict";

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use("Schema");

class ProgramsSchema extends Schema {
  up() {
    this.create("programs", (table) => {
      table.engine("InnoDB");
      table.bigIncrements();
      table.string("title", 254).notNullable();
      table.text("description").nullable();
      table.string("image_name", 254).nullable();
      table.string("image_mime", 254).nullable();
      table.text("image_path").nullable();
      table.text("image_url").nullable();
      table.timestamps();
    });
  }

  down() {
    this.drop("programs");
  }
}

module.exports = ProgramsSchema;
