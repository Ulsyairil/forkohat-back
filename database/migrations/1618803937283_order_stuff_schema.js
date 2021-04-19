"use strict";

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use("Schema");

class OrderStuffSchema extends Schema {
  up() {
    this.create("order_stuffs", (table) => {
      table.increments();
      table
        .integer("order_id")
        .notNullable()
        .unsigned()
        .references("id")
        .inTable("orders");
      table.string("name", 254).notNullable();
      table.text("description").nullable();
      table.timestamps();
      table.timestamp("deleted_at", { precision: 6 }).nullable();
    });
  }

  down() {
    this.drop("order_stuffs");
  }
}

module.exports = OrderStuffSchema;
