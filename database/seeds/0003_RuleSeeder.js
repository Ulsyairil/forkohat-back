'use strict'

/** @type {import('@adonisjs/lucid/src/Factory')} */
const Factory = use('Factory')
const Database = use('Database')
const Moment = require('moment')

class RuleSeeder {
  async run() {
    const dateNow = Moment().format('YYYY-MM-DD HH:mm:ss')

    await Database.table('rules').insert([
      {
        name: 'Superadmin',
        is_superadmin: true,
        created_at: dateNow,
        updated_at: dateNow,
      },
      {
        name: 'Administrator',
        is_admin: true,
        created_at: dateNow,
        updated_at: dateNow,
      },
      {
        name: 'Guest',
        is_guest: true,
        created_at: dateNow,
        updated_at: dateNow,
      },
    ])

    console.log('Rules Generated')
  }
}

module.exports = RuleSeeder
