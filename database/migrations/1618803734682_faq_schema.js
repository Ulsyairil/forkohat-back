"use strict";

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use("Schema");

class FaqSchema extends Schema {
  up() {
    this.create("faqs", (table) => {
      table.bigIncrements();
      table.string("name").notNullable();
      table.timestamps();
      table.timestamp("deleted_at", { precision: 6 }).nullable();
    });
  }

  down() {
    this.drop("faqs");
  }
}

module.exports = FaqSchema;
