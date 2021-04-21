"use strict";

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use("Model");

class Program extends Model {
  static get table() {
    return "programs";
  }
}

module.exports = Program;
