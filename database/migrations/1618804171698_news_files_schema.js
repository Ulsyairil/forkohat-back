"use strict";

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use("Schema");

class NewsFilesSchema extends Schema {
  up() {
    this.create("news_files", (table) => {
      table.increments();
      table
        .integer("news_id")
        .notNullable()
        .unsigned()
        .references("id")
        .inTable("news");
      table.enu("type", ["banner", "files"]).notNullable();
      table.string("name", 254).notNullable();
      table.string("mime", 5).notNullable();
      table.text("path").notNullable();
      table.text("url").notNullable();
      table.timestamps();
      table.timestamp("deleted_at", { precision: 6 }).nullable();
    });
  }

  down() {
    this.drop("news_files");
  }
}

module.exports = NewsFilesSchema;
