"use strict";

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use("Schema");

class EventCommentSchema extends Schema {
  up() {
    this.create("event_comments", (table) => {
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
        .bigInteger("event_id")
        .notNullable()
        .unsigned()
        .references("id")
        .inTable("events")
        .onUpdate("cascade")
        .onDelete("cascade");
      table.text("comment").notNullable();
      table.timestamps();
    });
  }

  down() {
    this.drop("event_comments");
  }
}

module.exports = EventCommentSchema;
