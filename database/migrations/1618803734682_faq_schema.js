"use strict";

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use("Schema");

class FaqSchema extends Schema {
  up() {
    this.create("faqs", (table) => {
      table.engine("InnoDB");
      table.bigIncrements();
      table.string("name").notNullable();
      table.timestamps();
    });
  }

  down() {
    this.drop("faqs");
  }
}

module.exports = FaqSchema;
