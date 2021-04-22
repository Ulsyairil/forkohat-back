"use strict";

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use("Model");

class ProgramRuled extends Model {
  static get table() {
    return "program_ruled";
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

  rules() {
    return this.hasOne("App/Models/Rule", "rule_id", "id");
  }

  programs() {
    return this.hasOne("App/Models/Program", "program_id", "id");
  }
}

module.exports = ProgramRuled;
