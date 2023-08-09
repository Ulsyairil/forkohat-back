'use strict'

/*
|--------------------------------------------------------------------------
| FaqSeeder
|--------------------------------------------------------------------------
|
| Make use of the Factory instance to seed database with dummy data or
| make use of Lucid models directly.
|
*/

/** @type {import('@adonisjs/lucid/src/Factory')} */
const Factory = use('Factory')
const Database = use('Database')
const Faker = require('@faker-js/faker').default
const Moment = require('moment')

class FaqSeeder {
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

    console.log("FAQ's Generated")
  }
}

module.exports = FaqSeeder
