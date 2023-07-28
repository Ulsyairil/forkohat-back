"use strict";

/*
|--------------------------------------------------------------------------
| FaqTopicSeeder
|--------------------------------------------------------------------------
|
| Make use of the Factory instance to seed database with dummy data or
| make use of Lucid models directly.
|
*/

/** @type {import('@adonisjs/lucid/src/Factory')} */
const Factory = use("Factory");
const Database = use("Database");
const Faker = require("@faker-js/faker").default;
const Moment = require("moment");
const Chance = require("chance");

class FaqTopicSeeder {
  async run() {
    const dateNow = Moment().format("YYYY-MM-DD HH:mm:ss");
    const RandomNumber = new Chance();

    for (let index = 1; index <= 5; index++) {
      await Database.table("faq_topics").insert({
        faq_id: RandomNumber.integer({ min: 1, max: 10 }),
        title: Faker.lorem.lines(3),
        description: Faker.lorem.paragraph(),
        created_at: dateNow,
        updated_at: dateNow,
      });
    }

    console.log("FAQ Topic Generated");
  }
}

module.exports = FaqTopicSeeder;
