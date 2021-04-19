"use strict";

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use("Schema");

class NewsSchema extends Schema {
  up() {
    this.create("news", (table) => {
      table.increments();
      table
        .integer("author_id")
        .notNullable()
        .unsigned()
        .references("id")
        .inTable("users");
      table.string("title", 254).notNullable();
      table.text("content").nullable();
      table.date("date").nullable();
      table.timestamps();
      table.timestamp("deleted_at", { precision: 6 }).nullable();
    });
  }

  down() {
    this.drop("news");
  }
}

module.exports = NewsSchema;
