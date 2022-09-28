"use strict";

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use("Schema");

class CarouselsSchema extends Schema {
  up() {
    this.create("carousels", (table) => {
      table.bigIncrements();
      table.string("title", 254).nullable();
      table.text("description").nullable();
      table.string("image_name", 254).notNullable();
      table.string("image_mime", 254).notNullable();
      table.text("image_path").notNullable();
      table.text("image_url").notNullable();
      table.boolean("showed").notNullable().default("true");
      table.timestamps();
    });
  }

  down() {
    this.drop("carousels");
  }
}

module.exports = CarouselsSchema;
