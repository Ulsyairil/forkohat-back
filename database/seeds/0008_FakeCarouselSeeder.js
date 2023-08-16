'use strict'

/** @type {import('@adonisjs/lucid/src/Factory')} */
const Factory = use('Factory')
const Database = use('Database')
const Faker = require('@faker-js/faker').fakerID_ID
const Moment = require('moment')

class FakeCarouselSeeder {
  async run() {
    const dateNow = Moment().format('YYYY-MM-DD HH:mm:ss')

    for (let index = 1; index <= 5; index++) {
      await Database.table('carousels').insert({
        title: Faker.lorem.words(),
        description: Faker.lorem.paragraph(),
        image_name: Faker.system.commonFileName('png'),
        image_mime: Faker.system.fileExt('image/png'),
        image_path: Faker.system.filePath(),
        image_url: Faker.image.urlPlaceholder(),
        showed: true,
        created_at: dateNow,
        updated_at: dateNow,
      })
    }

    console.log('Fake Carousels Generated')
  }
}

module.exports = FakeCarouselSeeder
