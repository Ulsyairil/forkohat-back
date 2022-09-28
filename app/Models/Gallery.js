"use strict";

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use("Model");
const Moment = require("moment");

class Gallery extends Model {
  static get table() {
    return "galleries";
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

  UploadedBy() {
    return this.hasOne("App/Models/User", "uploaded_by", "id");
  }

  UpdatedBy() {
    return this.hasOne("App/Models/User", "updated_by", "id");
  }
}

module.exports = Gallery;
