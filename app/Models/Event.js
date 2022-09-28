"use strict";

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use("Model");
const Moment = require("moment");

class Event extends Model {
  static get table() {
    return "events";
  }

  static get dates() {
    return super.dates.concat([
      "registration_date",
      "end_registration_date",
      "expired_date",
      "created_at",
      "updated_at",
      "deleted_at",
    ]);
  }

  static formatDates(field, value) {
    if (field === "registration_date") {
      return Moment(new Date(value)).format("YYYY-MM-DD");
    }

    if (field === "end_registration_date") {
      return Moment(new Date(value)).format("YYYY-MM-DD");
    }

    if (field === "expired_date") {
      return Moment(new Date(value)).format("YYYY-MM-DD");
    }

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

  Author() {
    return this.hasOne("App/Models/User", "author_id", "id");
  }

  EventFiles() {
    return this.hasMany("App/Models/EventFile", "id", "event_id");
  }

  Arrangement() {
    return this.hasOne("App/Models/Arrangement", "arrangement_id", "id");
  }
}

module.exports = Event;
