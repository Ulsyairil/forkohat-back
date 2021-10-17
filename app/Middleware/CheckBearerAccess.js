"use strict";
/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */
const Rule = use("App/Models/Rule");

class CheckBearerAccess {
  /**
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Function} next
   */
  async handle({ auth, request, response }, next, schemes) {
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

    let user = await auth.getUser();

    if (schemes[0] == "superadmin") {
      if (user.rule_id != 1) {
        return response.status(403).send({
          message: "Forbidden Access",
        });
      }

      await next();
    }

    if (schemes[0] == "admin") {
      if (user.rule_id != 2) {
        return response.status(403).send({
          message: "Forbidden Access",
        });
      }

      await next();
    }

    await next();
  }
}

module.exports = CheckBearerAccess;
