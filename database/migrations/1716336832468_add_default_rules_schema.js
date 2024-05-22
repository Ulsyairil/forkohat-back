'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')
const Moment = require('moment')
const Database = use('Database')

class AddDefaultRulesSchema extends Schema {
  async up () {
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
  }

  down () {
  }
}

module.exports = AddDefaultRulesSchema
