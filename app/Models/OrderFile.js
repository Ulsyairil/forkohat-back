"use strict";

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use("Model");

class OrderFile extends Model {
  static get table() {
    return "order_files";
  }

  orderStuffs() {
    return this.hasMany("App/Models/OrderStuff");
  }
}

module.exports = OrderFile;
