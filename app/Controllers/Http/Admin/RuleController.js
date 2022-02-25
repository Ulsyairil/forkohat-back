"use strict";

const Rule = use("App/Models/Rule");
const { validate } = use("Validator");

class RuleController {
  async index({ auth, request, response }) {
    try {
      // Validate request
      const rules = {
        page: "required|integer",
        limit: "required|integer",
        order: "required|in:asc,desc",
        search: "string",
      };

      const validation = await validate(request.all(), rules);

      if (validation.fails()) {
        return response.status(422).send(validation.messages()[0]);
      }

      const page = request.input("page");
      const limit = request.input("limit");
      const order = request.input("order");
      const search = request.input("search");

      let query = Rule.query();

      if (search) {
        query.where("name", "like", `%${search}%`);
      }

      const data = await query
        .whereNot("id", 1)
        .whereNot("id", 2)
        .orderBy("id", order)
        .paginate(page, limit);

      return response.send(data);
    } catch (error) {
      console.log(error.message);
      return response.status(500).send(error.message);
    }
  }

  async indexAll({ auth, request, response }) {
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
      // Validate request
      const rules = {
        rule_id: "required|integer",
      };

      const validation = await validate(request.all(), rules);

      if (validation.fails()) {
        return response.status(422).send(validation.messages()[0]);
      }

      const rule_id = request.input("rule_id");

      let data = await Rule.query()
        .with("RuleItem")
        .where("id", rule_id)
        .first();

      if (!data) {
        return response.status(404).send({
          message: "Rule Tidak Ditemukan",
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
      // Validate request
      const rules = {
        rule: "required|string",
      };

      const validation = await validate(request.all(), rules);

      if (validation.fails()) {
        return response.status(422).send(validation.messages()[0]);
      }

      const rule = request.input("rule");

      const create = await Rule.create({
        name: rule,
      });

      return response.send(create);
    } catch (error) {
      console.log(error.message);
      return response.status(500).send(error.message);
    }
  }

  async edit({ request, response }) {
    try {
      // Validate request
      const rules = {
        rule_id: "required|integer",
        rule: "required|string",
      };

      const validation = await validate(request.all(), rules);

      if (validation.fails()) {
        return response.status(422).send(validation.messages()[0]);
      }

      const rule = request.input("rule");
      const rule_id = request.input("rule_id");

      const findRule = await Rule.find(rule_id);

      if (!findRule) {
        return response.status(404).send({
          message: "Rule Tidak Ditemukan",
        });
      }

      await Rule.query().where("id", rule_id).update({
        name: rule,
      });

      let data = await Rule.find(rule_id);

      return response.send(data);
    } catch (error) {
      console.log(error.message);
      return response.status(500).send(error.message);
    }
  }

  async destroy({ request, response }) {
    try {
      // Validate request
      const rules = {
        rule_id: "required|integer",
      };

      const validation = await validate(request.all(), rules);

      if (validation.fails()) {
        return response.status(422).send(validation.messages()[0]);
      }

      const rule_id = request.input("rule_id");

      const findRule = await Rule.find(rule_id);

      if (!findRule) {
        return response.status(404).send({
          message: "Rule Tidak Ditemukan",
        });
      }

      await Rule.query().where("id", rule_id).delete();

      return response.send({
        message: "Rule Berhasil Dihapus",
      });
    } catch (error) {
      console.log(error.message);
      return response.status(500).send(error.message);
    }
  }
}

module.exports = RuleController;
