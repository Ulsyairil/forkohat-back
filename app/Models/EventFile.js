"use strict";

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use("Model");

class EventFile extends Model {
  static get table() {
    return "event_files";
  }

  events() {
    return this.hasOne("App/Models/Event", "event_id", "id");
  }
}

module.exports = EventFile;
