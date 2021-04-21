"use strict";

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use("Model");

class Rule extends Model {
  static get table() {
    return "rules";
  }
}

module.exports = Rule;
