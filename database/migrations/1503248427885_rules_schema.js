"use strict";

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use("Schema");

class RulesSchema extends Schema {
  up() {
    this.create("rules", (table) => {
      table.engine("InnoDB");
      table.bigIncrements();
      table.string("name", 254).notNullable().unique();
      table.timestamps();
    });
  }

  down() {
    this.drop("rules");
  }
}

module.exports = RulesSchema;
