"use strict";

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use("Schema");

class UserFilesSchema extends Schema {
  up() {
    this.create("user_files", (table) => {
      table.bigIncrements();
      table
        .bigInteger("user_id")
        .notNullable()
        .unsigned()
        .references("id")
        .inTable("users")
        .onDelete('cascade')
        .unique();
      table.enu("type", ["profile_picture", "files"]).notNullable();
      table.string("name", 254).notNullable();
      table.string("mime", 5).notNullable();
      table.text("path").notNullable();
      table.text("url").notNullable();
      table.timestamps();
      table.timestamp("deleted_at", { precision: 6 }).nullable();
    });
  }

  down() {
    this.drop("user_files");
  }
}

module.exports = UserFilesSchema;
