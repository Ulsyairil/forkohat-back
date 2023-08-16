'use strict'

/** @type {import('@adonisjs/lucid/src/Factory')} */
const Factory = use('Factory')
const Database = use('Database')
const Chance = require('chance')
const Faker = require('@faker-js/faker').fakerID_ID
const Moment = require('moment')

class FakeNewsSeeder {
  async run() {
    const dateNow = Moment().format('YYYY-MM-DD HH:mm:ss')
    const RandomNumber = new Chance()

    for (let index = 1; index <= 13; index++) {
      await Database.table('news').insert({
        author_id: RandomNumber.integer({ min: 4, max: 13 }),
        title: Faker.lorem.sentence(5),
        content: Faker.lorem.paragraphs(),
        image_name: Faker.system.commonFileName('png'),
        image_mime: Faker.system.fileExt('image/png'),
        image_path: Faker.system.filePath(),
        image_url: Faker.image.urlPlaceholder(),
        created_at: dateNow,
        updated_at: dateNow,
      })
    }

    console.log('Fake News Generated')
  }
}

module.exports = FakeNewsSeeder
