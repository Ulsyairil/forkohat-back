"use strict";

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use("Model");

class FaqTopic extends Model {
  static get table() {
    return "faq_topics";
  }

  faqs() {
    return this.hasMany("App/Models/Faq");
  }
}

module.exports = FaqTopic;
