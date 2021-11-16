"use strict";

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use("Schema");

class ArrangementItemsSchema extends Schema {
  up() {
    this.create("arrangement_items", (table) => {
      table.engine("InnoDB");
      table.bigIncrements();
      table
        .bigInteger("arrangement_id")
        .notNullable()
        .unsigned()
        .references("id")
        .inTable("arrangements")
        .onUpdate("cascade")
        .onDelete("cascade");
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
      table.string("title", 254).notNullable();
      table.text("description").nullable();
      table.string("file_name", 254).notNullable();
      table.string("file_mime", 254).notNullable();
      table.text("file_path").notNullable();
      table.text("file_url").notNullable();
      table
        .enu("showed", ["public", "member", "private"])
        .default("private")
        .notNullable();
      table.timestamps();
      table.timestamp("deleted_at", { precision: 6 }).nullable();
    });
  }

  down() {
    this.drop("arrangement_items");
  }
}

module.exports = ArrangementItemsSchema;
