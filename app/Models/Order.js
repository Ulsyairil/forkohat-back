"use strict";

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use("Model");
const Moment = use("moment");

class Order extends Model {
  static get table() {
    return "orders";
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

  programs() {
    return this.hasMany("App/Models/Program", "program_id", "id");
  }

  orderStuffs() {
    return this.hasMany("App/Models/OrderStuff", "id", "order_id");
  }
}

module.exports = Order;
