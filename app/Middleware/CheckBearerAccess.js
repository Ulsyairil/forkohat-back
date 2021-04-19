"use strict";
/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

class CheckBearerAccess {
  /**
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Function} next
   */
  async handle({ auth, request, response }, next) {
    // call next to advance the request
    let bearer = request.header("authorization");
    if (bearer == undefined)
      return response.status(401).send({
        message: "Unauthenticated",
      });

    let check = await auth.check();
    if (check == false)
      return response.status(403).send({
        message: "Missing or invalid jwt token",
      });

    await next();
  }
}

module.exports = CheckBearerAccess;
