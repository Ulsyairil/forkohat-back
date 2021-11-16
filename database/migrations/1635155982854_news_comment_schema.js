"use strict";

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use("Schema");

class NewsCommentSchema extends Schema {
  up() {
    this.create("news_comments", (table) => {
      table.bigIncrements();
      table
        .bigInteger("user_id")
        .notNullable()
        .unsigned()
        .references("id")
        .inTable("users")
        .onUpdate("cascade")
        .onDelete("cascade");
      table
        .bigInteger("news_id")
        .notNullable()
        .unsigned()
        .references("id")
        .inTable("news")
        .onUpdate("cascade")
        .onDelete("cascade");
      table.text("comment").notNullable();
      table.timestamps();
    });
  }

  down() {
    this.drop("news_comments");
  }
}

module.exports = NewsCommentSchema;
