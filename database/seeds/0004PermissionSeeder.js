"use strict";

/*
|--------------------------------------------------------------------------
| 0004PermissionSeeder
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

class PermissionSeeder {
  async run() {
    const dateNow = Moment().format("YYYY-MM-DD HH:mm:ss");

    for (let rule = 4; rule < 54; rule++) {
      for (let program = 2; program < 7; program++) {
        for (let arrangement = 1; arrangement < 11; arrangement++) {
          await Database.table("permissions").insert({
            rule_id: rule,
            program_id: program,
            arrangement_id: arrangement,
            created_at: dateNow,
            updated_at: dateNow,
          });
        }
      }
    }

    console.log("Permissions Generated");
  }
}

module.exports = PermissionSeeder;
