"use strict";

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use("Schema");

class FaqTopicSchema extends Schema {
  up() {
    this.create("faq_topics", (table) => {
      table.engine("InnoDB");
      table.bigIncrements();
      table
        .bigInteger("faq_id")
        .notNullable()
        .unsigned()
        .references("id")
        .inTable("faqs")
        .onUpdate("cascade")
        .onDelete("cascade");
      table.string("title", 254).notNullable();
      table.text("description").nullable();
      table.timestamps();
    });
  }

  down() {
    this.drop("faq_topics");
  }
}

module.exports = FaqTopicSchema;
