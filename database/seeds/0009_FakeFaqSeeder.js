'use strict'

/** @type {import('@adonisjs/lucid/src/Factory')} */
const Factory = use('Factory')
const Database = use('Database')
const Faker = require('@faker-js/faker').fakerID_ID
const Moment = require('moment')

class FakeFaqSeeder {
  async run() {
    const dateNow = Moment().format('YYYY-MM-DD HH:mm:ss')

    for (let index = 1; index <= 10; index++) {
      await Database.table('faqs').insert({
        title: Faker.lorem.words(),
        description: Faker.lorem.paragraphs(),
        created_at: dateNow,
        updated_at: dateNow,
      })
    }

    console.log("Fake FAQ's Generated")
  }
}

module.exports = FakeFaqSeeder
