"use strict";

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use("Model");
const Moment = require("moment");

class FaqTopic extends Model {
  static get table() {
    return "faq_topics";
  }

  static get dates() {
    return super.dates.concat(["deleted_at"]);
  }

  static formatDates(field, value) {
    if (field === "created_at") {
      return Moment(value).format("YYYY-MM-DD HH:mm:ss");
    }

    if (field === "updated_at") {
      return Moment(value).format("YYYY-MM-DD HH:mm:ss");
    }

    if (field === "deleted_at") {
      return Moment(value).format("YYYY-MM-DD HH:mm:ss");
    }

    return super.formatDates(field, value);
  }

  faqs() {
    return this.hasMany("App/Models/Faq", "faq_id", "id");
  }
}

module.exports = FaqTopic;
