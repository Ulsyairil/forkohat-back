"use strict";

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use("Model");
const Moment = require("moment");

class FaqTopic extends Model {
  static get table() {
    return "faq_topics";
  }

  Faq() {
    return this.hasMany("App/Models/Faq", "faq_id", "id");
  }
}

module.exports = FaqTopic;
