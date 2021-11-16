"use strict";

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use("Model");
const Moment = require("moment");

class Arrangement extends Model {
  static get table() {
    return "arrangements";
  }

  static get dates() {
    return super.dates.concat(["created_at", "updated_at"]);
  }

  static formatDates(field, value) {
    if (field === "created_at") {
      return Moment(value).format("YYYY-MM-DD HH:mm:ss");
    }

    if (field === "updated_at") {
      return Moment(value).format("YYYY-MM-DD HH:mm:ss");
    }

    return super.formatDates(field, value);
  }

  Program() {
    return this.hasOne("App/Models/Program", "program_id", "id");
  }

  ArrangementItem() {
    return this.hasOne("App/Models/ArrangementItem", "id", "arrangement_id");
  }
}

module.exports = Arrangement;
