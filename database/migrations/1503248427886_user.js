"use strict";

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use("Schema");

class UserSchema extends Schema {
  up() {
    this.create("users", (table) => {
      table.increments();
      table
        .integer("rule_id")
        .notNullable()
        .unsigned()
        .references("id")
        .inTable("rules");
      table.string("name", 254).notNullable().unique();
      table.string("email", 254).notNullable().unique();
      table.string("nip", 18).nullable().unique();
      table.string("password", 60).notNullable();
      table.string("job", 254).notNullable();
      table.integer("district").notNullable();
      table.integer("sub_district").nullable();
      table
        .enu("gender", ["male", "female", "secret"])
        .default("secret")
        .notNullable();
      table.text("bio").nullable();
      table.timestamps();
      table.timestamp("deleted_at", { precision: 6 }).nullable();
    });
  }

  down() {
    this.drop("users");
  }
}

module.exports = UserSchema;
