"use strict";

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use("Schema");

class RulesSchema extends Schema {
  up() {
    this.create("rules", (table) => {
      table.engine("InnoDB");
      table.bigIncrements();
      table.string("name", 254).notNullable().unique();
      table.boolean("is_superadmin").default(false).notNullable();
      table.boolean("is_admin").default(false).notNullable();
      table.boolean("is_member").default(false).notNullable();
      table.boolean("is_guest").default(false).notNullable();
      table.timestamps();
    });
  }

  down() {
    this.drop("rules");
  }
}

module.exports = RulesSchema;
