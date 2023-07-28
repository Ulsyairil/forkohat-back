"use strict";

/*
|--------------------------------------------------------------------------
| NewsSeeder
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

class NewsSeeder {
  async run() {
    const dateNow = Moment().format("YYYY-MM-DD HH:mm:ss");
    const RandomNumber = new Chance();

    for (let index = 1; index <= 13; index++) {
      await Database.table("news").insert({
        author_id: RandomNumber.integer({ min: 4, max: 13 }),
        title: Faker.lorem.sentence(5),
        content: Faker.lorem.paragraphs(),
        image_name: Faker.system.commonFileName("png"),
        image_mime: Faker.system.fileExt("image/png"),
        image_path: Faker.system.filePath(),
        image_url: Faker.image.imageUrl(),
        created_at: dateNow,
        updated_at: dateNow,
      });
    }

    console.log("News Generated");
  }
}

module.exports = NewsSeeder;
