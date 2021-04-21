"use strict";

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use("Model");

class ProgramFile extends Model {
  static get table() {
    return "program_files";
  }

  programs() {
    return this.hasOne("App/Models/Program");
  }
}

module.exports = ProgramFile;
