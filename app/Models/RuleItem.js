"use strict";

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use("Model");
const Moment = require("moment");

class RuleItem extends Model {
  static get table() {
    return "rule_items";
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

  Rule() {
    return this.hasOne("App/Models/Rule", "rule_id", "id");
  }

  Program() {
    return this.hasOne("App/Models/Program", "program_id", "id");
  }

  Arrangement() {
    return this.hasOne("App/Models/Arrangement", "arrangement_id", "id");
  }
}

module.exports = RuleItem;
