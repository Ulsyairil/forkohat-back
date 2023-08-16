'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class OrgSchema extends Schema {
  up() {
    this.create('orgs', table => {
      table.bigIncrements()
      table
        .bigInteger('user_id')
        .notNullable()
        .unsigned()
        .references('id')
        .inTable('users')
        .onUpdate('cascade')
        .onDelete('cascade')
      table.bigInteger('parent_id').nullable()
      table.text('area').nullable()
      table.string('office').nullable()
      table.string('position_name').notNullable()
      table.timestamps()
    })
  }

  down() {
    this.drop('orgs')
  }
}

module.exports = OrgSchema
