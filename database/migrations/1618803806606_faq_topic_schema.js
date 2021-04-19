"use strict";

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use("Schema");

class FaqTopicSchema extends Schema {
  up() {
    this.create("faq_topics", (table) => {
      table.increments();
      table
        .integer("faq_id")
        .notNullable()
        .unsigned()
        .references("id")
        .inTable("faqs");
      table.string("title", 254).notNullable();
      table.text("description").nullable();
      table.timestamps();
      table.timestamp("deleted_at", { precision: 6 }).nullable();
    });
  }

  down() {
    this.drop("faq_topics");
  }
}

module.exports = FaqTopicSchema;
