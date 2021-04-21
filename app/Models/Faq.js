"use strict";

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use("Model");

class Faq extends Model {
  static get table() {
    return "faqs";
  }
}

module.exports = Faq;
