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
const Database = use("Database");
const Hash = use("Hash");
const Moment = require("moment");

class UserSeeder {
  async run() {
    await Database.table("users").insert([
      {
        rule_id: 1,
        fullname: "Super Administrator",
        username: "superadmin",
        email: "superadmin@forkohat.id",
        password: await Hash.make("superadmin12345"),
        created_at: Moment().format("YYYY-MM-DD HH:mm:ss"),
        updated_at: Moment().format("YYYY-MM-DD HH:mm:ss"),
      },
      {
        rule_id: 2,
        fullname: "Administrator",
        username: "administrator",
        email: "admin@forkohat.id",
        password: await Hash.make("admin12345"),
        created_at: Moment().format("YYYY-MM-DD HH:mm:ss"),
        updated_at: Moment().format("YYYY-MM-DD HH:mm:ss"),
      },
      {
        rule_id: 3,
        fullname: "Guest",
        username: "guest",
        email: "guest@forkohat.id",
        password: await Hash.make("guest12345"),
        created_at: Moment().format("YYYY-MM-DD HH:mm:ss"),
        updated_at: Moment().format("YYYY-MM-DD HH:mm:ss"),
      },
    ]);

    console.log("Users Generated");
  }
}

module.exports = UserSeeder;
