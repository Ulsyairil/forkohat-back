"use strict";

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use("Model");
const Moment = require("moment");

class EventFile extends Model {
  static get table() {
    return "event_files";
  }

  static get dates() {
    return super.dates.concat(["created_at", "updated_at", "deleted_at"]);
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

  Event() {
    return this.hasOne("App/Models/Event", "event_id", "id");
  }
}

module.exports = EventFile;
