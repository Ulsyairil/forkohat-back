"use strict";

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use("Schema");

class UserSchema extends Schema {
  up() {
    this.create("users", (table) => {
      table.engine("InnoDB");
      table.bigIncrements();
      table
        .bigInteger("rule_id")
        .notNullable()
        .unsigned()
        .references("id")
        .inTable("rules")
        .onUpdate("cascade")
        .onDelete("cascade");
      table.string("fullname", 254).notNullable();
      table.string("username", 254).notNullable().unique();
      table.string("email", 254).nullable().unique();
      table.string("password", 60).notNullable();
      table.string("image_name", 254).nullable();
      table.string("image_mime", 254).nullable();
      table.text("image_path").nullable();
      table.text("image_url").nullable();
      table.timestamps();
      table.timestamp("deleted_at", { precision: 6 }).nullable();
    });
  }

  down() {
    this.drop("users");
  }
}

module.exports = UserSchema;
