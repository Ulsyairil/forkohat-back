"use strict";

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use("Schema");

class AllowedIpSchema extends Schema {
  up() {
    this.create("allowed_ip", (table) => {
      table.engine("InnoDB");
      table.bigIncrements();
      table.string("ip_address").notNullable();
      table.timestamps();
    });
  }

  down() {
    this.drop("allowed_ip");
  }
}

module.exports = AllowedIpSchema;
