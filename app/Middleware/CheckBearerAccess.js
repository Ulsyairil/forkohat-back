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
  async handle({ auth, request, response }, next, schemes) {
    // call next to advance the request
    let bearer = request.header("authorization");
    if (bearer == undefined)
      return response.status(401).send({
        message: "Unauthenticated",
      });

    try {
      await auth.check();
    } catch (error) {
      return response.status(403).send({
        message: "Missing or invalid api token",
      });
    }

    let user = await auth.getUser();

    if (schemes[0] == "admin") {
      if (user.rule_id != 1) {
        return response.status(403).send({
          message: "Forbidden Access",
        });
      }

      await next();
    }

    if (schemes[0] == "member") {
      if (user.rule_id != (1 && 2)) {
        return response.status(403).send({
          message: "Forbidden Access",
        });
      }

      await next();
    }

    if (schemes[0] == "public") {
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
