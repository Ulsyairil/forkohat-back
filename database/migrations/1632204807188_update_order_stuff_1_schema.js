"use strict";

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use("Schema");

class UpdateOrderStuff1Schema extends Schema {
  up() {
    this.table("order_stuffs", (table) => {
      // alter table
      table
        .enu("showed", ["public", "member", "private"])
        .default("private")
        .notNullable();
      table
        .bigInteger("user_id")
        .notNullable()
        .unsigned()
        .references("id")
        .inTable("users")
        .onDelete("cascade");
    });
  }

  down() {
    // this.table("order_stuffs", (table) => {
    // reverse alternations
    // });
  }
}

module.exports = UpdateOrderStuff1Schema;
