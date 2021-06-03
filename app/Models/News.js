'use strict';

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model');
const Moment = use('moment');

class News extends Model {
  static get table() {
    return 'news';
  }

  static get dates() {
    return super.dates.concat(['deleted_at']);
  }

  static formatDates(field, value) {
    if (field === 'created_at') {
      return Moment(value).format('YYYY-MM-DD HH:mm:ss');
    }

    if (field === 'updated_at') {
      return Moment(value).format('YYYY-MM-DD HH:mm:ss');
    }

    if (field === 'deleted_at') {
      return Moment(value).format('YYYY-MM-DD HH:mm:ss');
    }

    return super.formatDates(field, value);
  }

  users() {
    return this.hasOne('App/Models/User', 'author_id', 'id');
  }

  newsFiles() {
    return this.hasMany('App/Models/NewsFile', 'id', 'news_id');
  }
}

module.exports = News;
