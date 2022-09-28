"use strict";

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use("Schema");

class GallerySchema extends Schema {
  up() {
    this.create("galleries", (table) => {
      table.increments();
      table
        .bigInteger("uploaded_by")
        .notNullable()
        .unsigned()
        .references("id")
        .inTable("users")
        .onUpdate("cascade")
        .onDelete("cascade");
      table
        .bigInteger("updated_by")
        .notNullable()
        .unsigned()
        .references("id")
        .inTable("users")
        .onUpdate("cascade")
        .onDelete("cascade");
      table.string("title", 254).nullable();
      table.string("image_name", 254).notNullable();
      table.string("image_mime", 254).notNullable();
      table.text("image_path").notNullable();
      table.text("image_url").notNullable();
      table
        .enu("showed", ["public", "member", "private"])
        .default("private")
        .notNullable();
      table.timestamps();
    });
  }

  down() {
    this.drop("galleries");
  }
}

module.exports = GallerySchema;
