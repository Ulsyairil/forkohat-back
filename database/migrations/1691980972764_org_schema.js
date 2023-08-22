'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class OrgSchema extends Schema {
  up() {
    this.create('orgs', table => {
      table.bigIncrements()
      table
        .bigInteger('userId')
        .notNullable()
        .unsigned()
        .references('id')
        .inTable('users')
        .onUpdate('cascade')
        .onDelete('cascade')
      table
        .bigInteger('parentId')
        .nullable()
        .unsigned()
        .references('id')
        .inTable('orgs')
        .onUpdate('cascade')
        .onDelete('cascade')
      table.text('area').nullable()
      table.string('office').nullable()
      table.string('positionName').notNullable()
      table.timestamps()
    })
  }

  down() {
    this.drop('orgs')
  }
}

module.exports = OrgSchema
