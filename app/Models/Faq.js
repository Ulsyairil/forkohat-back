"use strict";

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use("Model");
const Moment = require("moment");

class Faq extends Model {
  static get table() {
    return "faqs";
  }

  FaqTopic() {
    return this.hasMany("App/Models/FaqTopic", "id", "faq_id");
  }
}

module.exports = Faq;
