"use strict";

const Rule = use("App/Models/Rule");
const Permission = use("App/Models/Permission");
const Arrangement = use("App/Models/Arrangement");
const Program = use("App/Models/Program");
const { validate } = use("Validator");

class PermissionController {
  async index({ request, response }) {
    try {
      // Validate request
      const rules = {
        rule_id: "required|integer",
        page: "required|integer",
        limit: "required|integer",
        order: "required|in:asc,desc",
      };

      const validation = await validate(request.all(), rules);

      if (validation.fails()) {
        return response.status(422).send(validation.messages()[0]);
      }

      const rule_id = request.input("rule_id");
      const page = request.input("page");
      const limit = request.input("limit");
      const order = request.input("order");

      let query = Permission.query().with("Program").with("Arrangement");

      let data = await query
        .where("rule_id", rule_id)
        .orderBy("id", order)
        .paginate(page, limit);

      return response.send(data);
    } catch (error) {
      console.log(error.message);
      return response.status(500).send(error.message);
    }
  }

  async indexAll({ request, response }) {
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

      const data = await Permission.query().where("rule_id", rule_id).fetch();

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
        rule_id: "required|integer",
        program_id: "required|integer",
        arrangement_id: "required|integer",
      };

      const validation = await validate(request.all(), rules);

      if (validation.fails()) {
        return response.status(422).send(validation.messages()[0]);
      }

      const rule_id = request.input("rule_id");
      const program_id = request.input("program_id");
      const arrangement_id = request.input("arrangement_id");

      const findRule = await Rule.find(rule_id);
      const findProgram = await Program.find(program_id);
      const findArrangement = await Arrangement.find(arrangement_id);

      const findPermissionExist = await Permission.query()
        .where("rule_id", rule_id)
        .where("program_id", program_id)
        .where("arrangement_id", arrangement_id)
        .first();

      if (findPermissionExist) {
        return response.status(400).send({
          message: "Permission is exist",
        });
      }

      if (!findRule) {
        return response.status(404).send({
          message: "Rule not found",
        });
      }

      if (!findProgram) {
        return response.status(404).send({
          message: "Program not found",
        });
      }

      if (!findArrangement) {
        return response.status(404).send({
          message: "Arrangement not found",
        });
      }

      const createRule = await Permission.create({
        rule_id: rule_id,
        program_id: program_id,
        arrangement_id: arrangement_id,
      });

      return response.send(createRule);
    } catch (error) {
      console.log(error.message);
      return response.status(500).send(error.message);
    }
  }

  async edit({ request, response }) {
    try {
      // Validate request
      const rules = {
        id: "required|integer",
        rule_id: "required|integer",
        program_id: "required|integer",
        arrangement_id: "required|integer",
      };

      const validation = await validate(request.all(), rules);

      if (validation.fails()) {
        return response.status(422).send(validation.messages()[0]);
      }

      const rule_item_id = request.input("id");
      const rule_id = request.input("rule_id");
      const program_id = request.input("program_id");
      const arrangement_id = request.input("arrangement_id");

      const findPermission = await Permission.find(rule_item_id);
      const findRule = await Rule.find(rule_id);
      const findProgram = await Program.find(program_id);
      const findArrangement = await Arrangement.find(arrangement_id);

      if (!findPermission) {
        return response.status(404).send({
          message: "Permission not found",
        });
      }

      if (!findRule) {
        return response.status(404).send({
          message: "Rule not found",
        });
      }

      if (!findProgram) {
        return response.status(404).send({
          message: "Program not found",
        });
      }

      if (!findArrangement) {
        return response.status(404).send({
          message: "Arrangement not found",
        });
      }

      await Permission.query().where("id", rule_id).update({
        rule_id: rule_id,
        program_id: program_id,
        arrangement_id: arrangement_id,
      });

      let data = await Permission.find(rule_item_id);

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
        id: "required|integer",
      };

      const validation = await validate(request.all(), rules);

      if (validation.fails()) {
        return response.status(422).send(validation.messages()[0]);
      }

      const rule_item_id = request.input("id");

      const findPermission = await Permission.find(rule_item_id);

      if (!findPermission) {
        return response.status(404).send({
          message: "Permission not found",
        });
      }

      await Permission.query().where("id", rule_item_id).delete();

      return response.send({
        message: "Permission deleted",
      });
    } catch (error) {
      console.log(error.message);
      return response.status(500).send(error.message);
    }
  }
}

module.exports = PermissionController;
