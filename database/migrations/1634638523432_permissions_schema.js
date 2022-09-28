"use strict";

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use("Schema");

class PermissionsSchema extends Schema {
  up() {
    this.create("permissions", (table) => {
      table.engine("InnoDB");
      table.bigIncrements();
      table
        .bigInteger("rule_id")
        .unsigned()
        .references("id")
        .inTable("rules")
        .onDelete("cascade")
        .onUpdate("cascade");
      table
        .bigInteger("program_id")
        .notNullable()
        .unsigned()
        .references("id")
        .inTable("programs")
        .onDelete("cascade")
        .onUpdate("cascade");
      table
        .bigInteger("arrangement_id")
        .notNullable()
        .unsigned()
        .references("id")
        .inTable("arrangements")
        .onDelete("cascade")
        .onUpdate("cascade");
      table.timestamps();
    });
  }

  down() {
    this.drop("permissions");
  }
}

module.exports = PermissionsSchema;
