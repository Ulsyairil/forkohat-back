"use strict";

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use("Schema");

class GallerySchema extends Schema {
  up() {
    this.create("galleries", (table) => {
      table.increments();
      table.string("picture_name", 254).notNullable();
      table.string("picture_description", 254).notNullable();
      table.string("name", 254).notNullable();
      table.string("mime", 254).notNullable();
      table.text("path").notNullable();
      table.text("url").notNullable();
      table.timestamps();
    });
  }

  down() {
    this.drop("galleries");
  }
}

module.exports = GallerySchema;
