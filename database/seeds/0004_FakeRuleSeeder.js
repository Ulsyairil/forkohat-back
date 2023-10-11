'use strict'

/** @type {import('@adonisjs/lucid/src/Factory')} */
const Factory = use('Factory')
const Database = use('Database')
const Moment = require('moment')

class FakeRuleSeeder {
  async run() {
    const dateNow = Moment().format('YYYY-MM-DD HH:mm:ss')

    for (let program = 2; program < 7; program++) {
      for (let index = 1; index < 11; index++) {
        await Database.table('rules').insert({
          name: `Program ID ${program} - Arrangement ID ${index}`,
          is_member: true,
          created_at: dateNow,
          updated_at: dateNow,
        })
      }
    }

    console.log('Fake Rules Generated')
  }
}

module.exports = FakeRuleSeeder
