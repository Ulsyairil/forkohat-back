"use strict";

/*
|--------------------------------------------------------------------------
| CarouselSeeder
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

class CarouselSeeder {
  async run() {
    const dateNow = Moment().format("YYYY-MM-DD HH:mm:ss");

    for (let index = 1; index <= 5; index++) {
      await Database.table("carousels").insert({
        title: Faker.lorem.lines(),
        description: Faker.lorem.paragraph(),
        image_name: Faker.system.commonFileName("png"),
        image_mime: Faker.system.fileExt("image/png"),
        image_path: Faker.system.filePath(),
        image_url: Faker.image.imageUrl(),
        showed: true,
        created_at: dateNow,
        updated_at: dateNow,
      });
    }

    console.log("Carousels Generated");
  }
}

module.exports = CarouselSeeder;
