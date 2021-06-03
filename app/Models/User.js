'use strict';

/** @type {import('@adonisjs/framework/src/Hash')} */
const Hash = use('Hash');

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model');
const Moment = use('moment');

class User extends Model {
  static get table() {
    return 'users';
  }

  static boot() {
    super.boot();

    /**
     * A hook to hash the user password before saving
     * it to the database.
     */
    this.addHook('beforeSave', async (userInstance) => {
      if (userInstance.dirty.password) {
        userInstance.password = await Hash.make(userInstance.password);
      }
    });
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

  /**
   * A relationship on tokens is required for auth to
   * work. Since features like `refreshTokens` or
   * `rememberToken` will be saved inside the
   * tokens table.
   *
   * @method tokens
   *
   * @return {Object}
   */
  tokens() {
    return this.hasMany('App/Models/Token');
  }

  rules() {
    return this.hasMany('App/Models/Rule', 'rule_id', 'id');
  }

  programRuled() {
    return this.hasMany('App/Models/ProgramRuled', 'rule_id', 'rule_id');
  }

  userFiles() {
    return this.hasMany('App/Models/UserFile', 'id', 'user_id');
  }
}

module.exports = User;
