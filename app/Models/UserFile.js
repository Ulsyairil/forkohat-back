"use strict";

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use("Model");

class UserFile extends Model {
  static get table() {
    return "user_files";
  }

  users() {
    return this.hasMany("App/Models/User");
  }
}

module.exports = UserFile;
