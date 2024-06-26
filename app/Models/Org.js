'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')
const Moment = require('moment')

class Org extends Model {
  static get table() {
    return 'orgs'
  }

  static get dates() {
    return super.dates.concat(['created_at', 'updated_at'])
  }

  static formatDates(field, value) {
    if (field === 'created_at') {
      return Moment(value).format('YYYY-MM-DD HH:mm:ss')
    }

    if (field === 'updated_at') {
      return Moment(value).format('YYYY-MM-DD HH:mm:ss')
    }

    return super.formatDates(field, value)
  }

  User() {
    return this.hasOne('App/Models/User', 'userId', 'id')
  }
}

module.exports = Org
