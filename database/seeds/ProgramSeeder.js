"use strict";

/*
|--------------------------------------------------------------------------
| ProgramSeeder
|--------------------------------------------------------------------------
|
| Make use of the Factory instance to seed database with dummy data or
| make use of Lucid models directly.
|
*/

/** @type {import('@adonisjs/lucid/src/Factory')} */
const Factory = use("Factory");
const Database = use("Database");
const Moment = require("moment");

class ProgramSeeder {
  async run() {
    await Database.table("programs").insert({
      title: "Umum",
      Description: "Program Umum Forkohat",
      created_at: Moment().format("YYYY-MM-DD HH:mm:ss"),
      updated_at: Moment().format("YYYY-MM-DD HH:mm:ss"),
    });
  }
}

module.exports = ProgramSeeder;
