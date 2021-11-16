"use strict";

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use("Model");

class AllowedIp extends Model {
  static get table() {
    return "allowed_ip";
  }
}

module.exports = AllowedIp;
