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
    const dateNow = Moment().format("YYYY-MM-DD HH:mm:ss");

    await Database.table("rules").insert([
      {
        name: "Superadmin",
        is_superadmin: true,
        created_at: dateNow,
        updated_at: dateNow,
      },
      {
        name: "Administrator",
        is_admin: true,
        created_at: dateNow,
        updated_at: dateNow,
      },
      {
        name: "Guest",
        is_guest: true,
        created_at: dateNow,
        updated_at: dateNow,
      },
    ]);

    for (let program = 2; program < 7; program++) {
      for (let index = 1; index < 11; index++) {
        await Database.table("rules").insert({
          name: `Program ID ${program} - Arrangement ID ${index}`,
          is_member: true,
          created_at: dateNow,
          updated_at: dateNow,
        });
      }
    }

    console.log("Rules Generated");
  }
}

module.exports = RuleSeeder;
