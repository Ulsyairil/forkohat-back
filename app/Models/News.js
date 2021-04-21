"use strict";

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use("Model");

class News extends Model {
  static get table() {
    return "news";
  }

  users() {
    return this.hasOne("App/Models/User");
  }
}

module.exports = News;
