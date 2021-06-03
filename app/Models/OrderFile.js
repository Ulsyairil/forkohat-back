"use strict";

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use("Model");
const Moment = use("moment");

class OrderFile extends Model {
  static get table() {
    return "order_files";
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

  orderStuffs() {
    return this.hasOne("App/Models/OrderStuff", "order_stuff_id", "id");
  }
}

module.exports = OrderFile;
