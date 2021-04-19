"use strict";

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use("Schema");

class RulesSchema extends Schema {
  up() {
    this.create("rules", (table) => {
      table.increments();
      table.string("rule", 254).notNullable().unique();
      table.timestamps();
      table.timestamp("deleted_at", { precision: 6 }).nullable();
    });
  }

  down() {
    this.drop("rules");
  }
}

module.exports = RulesSchema;
