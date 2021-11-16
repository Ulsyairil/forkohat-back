"use strict";

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use("Schema");

class EventsSchema extends Schema {
  up() {
    this.create("events", (table) => {
      table.engine("InnoDB");
      table.bigIncrements();
      table
        .bigInteger("author_id")
        .notNullable()
        .unsigned()
        .references("id")
        .inTable("users")
        .onUpdate("cascade")
        .onDelete("cascade");
      table
        .bigInteger("arrangement_id")
        .notNullable()
        .unsigned()
        .references("id")
        .inTable("arrangements")
        .onUpdate("cascade")
        .onDelete("cascade");
      table.string("title", 254).notNullable();
      table.text("description").nullable();
      table.date("registration_date").nullable();
      table.date("end_registration_date").nullable();
      table.date("expired_date").nullable();
      table.text("registration_url").nullable();
      table.string("image_name", 254).notNullable();
      table.string("image_mime", 254).notNullable();
      table.text("image_path").notNullable();
      table.text("image_url").notNullable();
      table
        .enu("showed", ["public", "member", "private"])
        .default("private")
        .notNullable();
      table.timestamps();
      table.timestamp("deleted_at", { precision: 6 }).nullable();
    });
  }

  down() {
    this.drop("events");
  }
}

module.exports = EventsSchema;
