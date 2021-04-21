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
const Rules = use("App/Models/Rule");

class RuleSeeder {
  async run() {
    const query = await Rules.createMany([
      {
        rule: "Super Administrator",
      },
      {
        rule: "Administration",
      },
      {
        rule: "Balikpapan Utara - Tatanan 1",
      },
    ]);

    console.log(query);
  }
}

module.exports = RuleSeeder;
