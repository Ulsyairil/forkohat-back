"use strict";

/*
|--------------------------------------------------------------------------
| UserSeeder
|--------------------------------------------------------------------------
|
| Make use of the Factory instance to seed database with dummy data or
| make use of Lucid models directly.
|
*/

/** @type {import('@adonisjs/lucid/src/Factory')} */
const Factory = use("Factory");
const User = use("App/Models/User");

class UserSeeder {
  async run() {
    const query = await User.createMany([
      {
        rule_id: 1,
        email: "superadmin@forkohat.id",
        password: "superadmin12345",
        job: "Super Administrator Forkohat",
        district: 6471030,
      },
      {
        rule_id: 2,
        email: "admin@forkohat.id",
        password: "admin12345",
        job: "Administrator Forkohat",
        district: 6471030,
      },
    ]);
  }
}

module.exports = UserSeeder;
