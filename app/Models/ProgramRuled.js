"use strict";

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use("Model");

class ProgramRuled extends Model {
  static get table() {
    return "program_ruled";
  }

  rules() {
    return this.hasOne("App/Models/Rule");
  }

  programs() {
    return this.hasOne("App/Models/Program");
  }
}

module.exports = ProgramRuled;
