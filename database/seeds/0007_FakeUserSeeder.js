'use strict'

/** @type {import('@adonisjs/lucid/src/Factory')} */
const Factory = use('Factory')
const Database = use('Database')
const Hash = use('Hash')
const Chance = require('chance')
const Faker = require('@faker-js/faker').fakerID_ID
const Moment = require('moment')

class FakeUserSeeder {
  async run() {
    const RandomNumber = new Chance()
    const dateNow = Moment().format('YYYY-MM-DD HH:mm:ss')

    for (let index = 1; index < 11; index++) {
      await Database.table('users').insert({
        rule_id: RandomNumber.integer({ min: 4, max: 53 }),
        fullname: Faker.person.fullName(),
        username: Faker.person.firstName(),
        email: Faker.internet.email(),
        password: await Hash.make('member12345'),
        created_at: dateNow,
        updated_at: dateNow,
      })
    }

    console.log('Fake Users Generated')
  }
}

module.exports = FakeUserSeeder
