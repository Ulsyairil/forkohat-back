"use strict";

const Rule = use("App/Models/Rule");
const Moment = require("moment");

class RuleController {
  async index({ auth, request, response }) {
    try {
      let user = await auth.getUser();
      let data = await Rule.query()
        .whereNot("id", 1)
        .whereNot("id", 2)
        .orderBy("id", "desc")
        .fetch();
      console.log(data);

      return response.send(data);
    } catch (error) {
      console.log(error.message);
      return response.status(500).send(error.message);
    }
  }

  async indexAll({ request, response }) {
    try {
      let data = await Rule.query().orderBy("id", "desc").fetch();
      console.log(data);

      return response.send(data);
    } catch (error) {
      console.log(error.message);
      return response.status(500).send(error.message);
    }
  }

  async get({ request, response }) {
    try {
      let data = await Rule.find(request.input("rule_id"));

      if (!data) {
        return response.status(400).send({
          message: "not found",
        });
      }

      return response.send(data);
    } catch (error) {
      console.log(error.message);
      return response.status(500).send(error.message);
    }
  }

  async create({ request, response }) {
    try {
      let rule = await Rule.create({
        rule: request.input("rule"),
      });

      return response.send(rule);
    } catch (error) {
      console.log(error.message);
      return response.status(500).send(error.message);
    }
  }

  async edit({ request, response }) {
    try {
      await Rule.query()
        .where("id", request.input("rule_id"))
        .update({
          rule: request.input("rule"),
        });

      let data = await Rule.find(request.input("rule_id"));

      return response.send(data);
    } catch (error) {
      console.log(error.message);
      return response.status(500).send(error.message);
    }
  }

  async dump({ request, response }) {
    try {
      await Rule.query().where("id", request.input("rule_id")).update({
        deleted_at: Moment.now(),
      });

      let data = await Rule.find(request.input("rule_id"));

      return response.send(data);
    } catch (error) {
      console.log(error.message);
      return response.status(500).send(error.message);
    }
  }

  async restore({ request, response }) {
    try {
      await Rule.query().where("id", request.input("rule_id")).update({
        deleted_at: null,
      });

      let data = await Rule.find(request.input("rule_id"));

      return response.send(data);
    } catch (error) {
      console.log(error.message);
      return response.status(500).send(error.message);
    }
  }
}

module.exports = RuleController;
