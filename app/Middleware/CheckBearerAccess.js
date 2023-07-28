'use strict'
/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */
const User = use('App/Models/User')

class CheckBearerAccess {
  /**
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Function} next
   */
  async handle({ auth, request, response }, next, schemes) {
    // call next to advance the request
    let getUserLoggedIn = await auth.getUser()
    let getUser = await User.query()
      .with('Rule')
      .where('id', getUserLoggedIn.$originalAttributes.id)
      .first()
    let userData = getUser.toJSON()

    switch (schemes[0]) {
      case 'superadmin':
        userData.Rule.is_superadmin
          ? await next()
          : response.status(403).send({
              message: 'Forbidden Access',
            })
        break

      case 'admin':
        userData.Rule.is_admin
          ? await next()
          : response.status(403).send({
              message: 'Forbidden Access',
            })
        break

      case 'member':
        userData.Rule.is_member
          ? await next()
          : response.status(403).send({
              message: 'Forbidden Access',
            })
        break

      case 'guest':
        userData.Rule.is_guest
          ? await next()
          : response.status(403).send({
              message: 'Forbidden Access',
            })
        break

      default:
        await next()
        break
    }
  }
}

module.exports = CheckBearerAccess
