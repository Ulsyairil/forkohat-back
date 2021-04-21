"use strict";

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use("Schema");

class OrderFilesSchema extends Schema {
  up() {
    this.create("order_files", (table) => {
      table.increments();
      table
        .integer("order_stuff_id")
        .notNullable()
        .unsigned()
        .references("id")
        .inTable("order_stuffs");
      table.integer("page").notNullable();
      table.string("name", 254).notNullable();
      table.string("mime", 5).notNullable();
      table.text("path").notNullable();
      table.text("url").notNullable();
      table.timestamps();
      table.timestamp("deleted_at", { precision: 6 }).nullable();
    });
  }

  down() {
    this.drop("order_files");
  }
}

module.exports = OrderFilesSchema;
