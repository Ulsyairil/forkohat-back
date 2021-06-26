"use strict";

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use("Schema");

class CarouselPictureSchema extends Schema {
  up() {
    this.create("carousel_pictures", (table) => {
      table.increments();
      table.string("carousel_name", 254).notNullable();
      table.string("carousel_description", 254).notNullable();
      table.string("name", 254).notNullable();
      table.string("mime", 254).notNullable();
      table.text("path").notNullable();
      table.text("url").notNullable();
      table.timestamps();
    });
  }

  down() {
    this.drop("carousel_pictures");
  }
}

module.exports = CarouselPictureSchema;
