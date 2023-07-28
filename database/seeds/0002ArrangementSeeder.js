"use strict";

/*
|--------------------------------------------------------------------------
| ArrangementSeeder
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
const Faker = require("@faker-js/faker").default;

class ArrangementSeeder {
  async run() {
    const dateNow = Moment().format("YYYY-MM-DD HH:mm:ss");

    for (let program = 2; program < 7; program++) {
      for (let index = 1; index < 11; index++) {
        await Database.table("arrangements").insert({
          program_id: program,
          title: Faker.lorem.sentence(5),
          description: Faker.lorem.paragraph(),
          image_name: Faker.system.commonFileName("png"),
          image_mime: Faker.system.fileExt("image/png"),
          image_path: Faker.system.fileType(),
          image_url: Faker.image.city(),
          created_at: dateNow,
          updated_at: dateNow,
        });
      }
    }

    console.log("Arrangements Generated");
  }
}

module.exports = ArrangementSeeder;
