'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')
const Moment = require('moment')
const Database = use('Database')
const Hash = use('Hash')

class AddDefaultUsersSchema extends Schema {
  async up () {
    const dateNow = Moment().format('YYYY-MM-DD HH:mm:ss')

    await Database.table('users').insert([
      {
        rule_id: 1,
        fullname: 'Super Administrator',
        username: 'superadmin',
        email: 'superadmin@forkohat.id',
        password: await Hash.make('superadmin12345'),
        created_at: dateNow,
        updated_at: dateNow,
      },
      {
        rule_id: 2,
        fullname: 'Administrator',
        username: 'administrator',
        email: 'admin@forkohat.id',
        password: await Hash.make('admin12345'),
        created_at: dateNow,
        updated_at: dateNow,
      },
      {
        rule_id: 3,
        fullname: 'Guest',
        username: 'guest',
        email: 'guest@forkohat.id',
        password: await Hash.make('guest12345'),
        created_at: dateNow,
        updated_at: dateNow,
      },
    ])
  }

  down () {
  }
}

module.exports = AddDefaultUsersSchema
