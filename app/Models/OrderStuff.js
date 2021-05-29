"use strict";

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use("Model");
const Moment = use("moment");

class OrderStuff extends Model {
  static get table() {
    return "order_stuffs";
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

  orders() {
    return this.hasOne("App/Models/Order", "order_id", "id");
  }

  orderStuffFiles() {
    return this.hasMany("App/Models/OrderFile", "id", "order_stuff_id");
  }
}

module.exports = OrderStuff;
