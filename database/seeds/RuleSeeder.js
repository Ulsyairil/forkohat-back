"use strict";

/*
|--------------------------------------------------------------------------
| RuleSeeder
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

class RuleSeeder {
  async run() {
    await Database.table("rules").insert([
      {
        name: "Superadmin",
        is_superadmin: true,
        created_at: Moment().format("YYYY-MM-DD HH:mm:ss"),
        updated_at: Moment().format("YYYY-MM-DD HH:mm:ss"),
      },
      {
        name: "Administrator",
        is_admin: true,
        created_at: Moment().format("YYYY-MM-DD HH:mm:ss"),
        updated_at: Moment().format("YYYY-MM-DD HH:mm:ss"),
      },
      {
        name: "Guest",
        is_guest: true,
        created_at: Moment().format("YYYY-MM-DD HH:mm:ss"),
        updated_at: Moment().format("YYYY-MM-DD HH:mm:ss"),
      },
    ]);

    console.log("Rules Generated");
  }
}

module.exports = RuleSeeder;
