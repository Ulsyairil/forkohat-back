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
const Chance = require("chance");
const Faker = require("@faker-js/faker").default;

class UserSeeder {
  async run() {
    const RandomNumber = new Chance();
    const dateNow = Moment().format("YYYY-MM-DD HH:mm:ss");

    await Database.table("users").insert([
      {
        rule_id: 1,
        fullname: "Super Administrator",
        username: "superadmin",
        email: "superadmin@forkohat.id",
        password: await Hash.make("superadmin12345"),
        created_at: dateNow,
        updated_at: dateNow,
      },
      {
        rule_id: 2,
        fullname: "Administrator",
        username: "administrator",
        email: "admin@forkohat.id",
        password: await Hash.make("admin12345"),
        created_at: dateNow,
        updated_at: dateNow,
      },
      {
        rule_id: 3,
        fullname: "Guest",
        username: "guest",
        email: "guest@forkohat.id",
        password: await Hash.make("guest12345"),
        created_at: dateNow,
        updated_at: dateNow,
      },
    ]);

    for (let index = 1; index < 11; index++) {
      await Database.table("users").insert({
        rule_id: RandomNumber.integer({ min: 4, max: 53 }),
        fullname: Faker.name.findName(),
        username: Faker.name.firstName(),
        email: Faker.internet.email(),
        password: await Hash.make("member12345"),
        created_at: dateNow,
        updated_at: dateNow,
      });
    }

    console.log("Users Generated");
  }
}

module.exports = UserSeeder;
