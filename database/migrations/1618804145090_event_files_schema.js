'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class EventFilesSchema extends Schema {
  up() {
    this.create('event_files', table => {
      table.engine('InnoDB')
      table.bigIncrements()
      table
        .bigInteger('event_id')
        .notNullable()
        .unsigned()
        .references('id')
        .inTable('events')
        .onDelete('cascade')
        .onUpdate('cascade')
      table.string('title', 254).notNullable()
      table.string('name', 254).notNullable()
      table.string('mime', 254).notNullable()
      table.text('path').notNullable()
      table.text('url').notNullable()
      table.timestamps()
    })
  }

  down() {
    this.drop('event_files')
  }
}

module.exports = EventFilesSchema
