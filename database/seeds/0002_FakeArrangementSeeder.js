'use strict'

/** @type {import('@adonisjs/lucid/src/Factory')} */
const Factory = use('Factory')
const Database = use('Database')
const Faker = require('@faker-js/faker').fakerID_ID
const Moment = require('moment')

class FakeArrangementSeeder {
  async run() {
    const dateNow = Moment().format('YYYY-MM-DD HH:mm:ss')

    for (let program = 2; program < 7; program++) {
      for (let index = 1; index < 11; index++) {
        await Database.table('arrangements').insert({
          program_id: program,
          title: Faker.lorem.sentence(5),
          description: Faker.lorem.paragraph(),
          image_name: Faker.system.commonFileName('png'),
          image_mime: Faker.system.fileExt('image/png'),
          image_path: Faker.system.fileType(),
          image_url: Faker.image.urlPlaceholder(),
          created_at: dateNow,
          updated_at: dateNow,
        })
      }
    }

    console.log('Fake Arrangements Generated')
  }
}

module.exports = FakeArrangementSeeder
