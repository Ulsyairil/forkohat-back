"use strict";

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use("Schema");

class UpdateEventsSchema extends Schema {
  up() {
    this.table("events", (table) => {
      // alter table
      table
        .bigInteger("order_id")
        .notNullable()
        .unsigned()
        .references("id")
        .inTable("orders")
        .onDelete("cascade");
      table.text("url").nullable();
      table
        .enu("showed", ["public", "member", "private"])
        .default("private")
        .notNullable();
    });
  }

  down() {
    // this.table('update_events', (table) => {
    // reverse alternations
    // })
  }
}

module.exports = UpdateEventsSchema;
