"use strict";

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use("Model");

class NewsFile extends Model {
  static get table() {
    return "news_files";
  }

  news() {
    return this.hasOne("App/Models/News");
  }
}

module.exports = NewsFile;
