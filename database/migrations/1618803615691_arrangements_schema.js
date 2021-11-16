"use strict";

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use("Schema");

class ArrangementsSchema extends Schema {
  up() {
    this.create("arrangements", (table) => {
      table.engine("InnoDB");
      table.bigIncrements();
      table
        .bigInteger("program_id")
        .notNullable()
        .unsigned()
        .references("id")
        .inTable("programs")
        .onUpdate("cascade")
        .onDelete("cascade");
      table.string("title", 254).notNullable();
      table.text("description").nullable();
      table.string("image_name", 254).notNullable();
      table.string("image_mime", 254).notNullable();
      table.text("image_path").notNullable();
      table.text("image_url").notNullable();
      table.timestamps();
    });
  }

  down() {
    this.drop("arrangements");
  }
}

module.exports = ArrangementsSchema;
