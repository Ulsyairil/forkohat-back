"use strict";

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use("Model");

class OrderStuff extends Model {
  static get table() {
    return "order_stuffs";
  }

  orders() {
    return this.hasOne("App/Models/Order");
  }
}

module.exports = OrderStuff;
