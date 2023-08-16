'use strict'

/** @type {import('@adonisjs/lucid/src/Factory')} */
const Factory = use('Factory')
const Database = use('Database')
const Faker = require('@faker-js/faker').fakerID_ID
const Moment = require('moment')
const Voca = require('voca')

class FakeOrganizationChartSeeder {
  async run() {
    const dateNow = Moment().format('YYYY-MM-DD HH:mm:ss')
    const jobArea = Voca.upperCase(Faker.person.jobArea())

    await Database.table('orgs').insert({
      user_id: 4,
      area: jobArea,
      office: 'CEO OFFICE',
      position_name: 'CEO',
      created_at: dateNow,
      updated_at: dateNow,
    })

    await Database.table('orgs').insert({
      user_id: 5,
      area: jobArea,
      office: 'CTO OFFICE',
      position_name: 'CTO',
      created_at: dateNow,
      updated_at: dateNow,
    })

    await Database.table('orgs').insert({
      user_id: 6,
      area: jobArea,
      office: 'CFO OFFICE',
      position_name: 'CFO',
      created_at: dateNow,
      updated_at: dateNow,
    })

    for (let index = 7; index <= 10; index++) {
      await Database.table('orgs').insert({
        user_id: index,
        parent_id: 2,
        area: jobArea,
        office: 'IT OFFICE',
        position_name: 'STAFF IT',
        created_at: dateNow,
        updated_at: dateNow,
      })
    }

    for (let index = 11; index <= 13; index++) {
      await Database.table('orgs').insert({
        user_id: index,
        parent_id: 3,
        area: jobArea,
        office: 'FINANCIAL OFFICE',
        position_name: 'FINANCIAL MARKETING',
        created_at: dateNow,
        updated_at: dateNow,
      })
    }

    console.log('Fake Org Chart Generated')
  }
}

module.exports = FakeOrganizationChartSeeder
