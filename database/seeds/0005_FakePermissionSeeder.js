'use strict'

/** @type {import('@adonisjs/lucid/src/Factory')} */
const Factory = use('Factory')
const Database = use('Database')
const Moment = require('moment')

class FakePermissionSeeder {
  async run() {
    const dateNow = Moment().format('YYYY-MM-DD HH:mm:ss')

    for (let rule = 4; rule < 54; rule++) {
      for (let program = 2; program < 7; program++) {
        for (let arrangement = 1; arrangement < 11; arrangement++) {
          await Database.table('permissions').insert({
            rule_id: rule,
            program_id: program,
            arrangement_id: arrangement,
            created_at: dateNow,
            updated_at: dateNow,
          })
        }
      }
    }

    console.log('Fake Permissions Generated')
  }
}

module.exports = FakePermissionSeeder
