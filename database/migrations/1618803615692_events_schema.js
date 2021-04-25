"use strict";

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use("Schema");

class EventsSchema extends Schema {
  up() {
    this.create("events", (table) => {
      table.bigIncrements();
      table
        .bigInteger("author_id")
        .notNullable()
        .unsigned()
        .references("id")
        .inTable("users")
        .onDelete('cascade');
      table.string("name", 254).notNullable();
      table.text("content").nullable();
      table.date("registration_date").nullable();
      table.date("expired_date").nullable();
      table.timestamps();
      table.timestamp("deleted_at", { precision: 6 }).nullable();
    });
  }

  down() {
    this.drop("events");
  }
}

module.exports = EventsSchema;
