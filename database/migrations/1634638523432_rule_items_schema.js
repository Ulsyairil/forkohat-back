"use strict";

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use("Schema");

class RuleItemsSchema extends Schema {
  up() {
    this.create("rule_items", (table) => {
      table.bigIncrements();
      table
        .bigInteger("rule_id")
        .notNullable()
        .unsigned()
        .references("id")
        .inTable("rules")
        .onDelete("cascade");
      table
        .bigInteger("program_id")
        .notNullable()
        .unsigned()
        .references("id")
        .inTable("programs")
        .onDelete("cascade");
      table
        .bigInteger("arrangement_id")
        .notNullable()
        .unsigned()
        .references("id")
        .inTable("arrangements")
        .onDelete("cascade");
      table.timestamps();
    });
  }

  down() {
    this.drop("rule_items");
  }
}

module.exports = RuleItemsSchema;
