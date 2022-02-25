"use strict";

const Rule = use("App/Models/Rule");
const RuleItem = use("App/Models/RuleItem");
const Arrangement = use("App/Models/Arrangement");
const Program = use("App/Models/Program");
const { validate } = use("Validator");

class RuleItemController {
  async index({ request, response }) {
    try {
      // Validate request
      const rules = {
        page: "required|integer",
        limit: "required|integer",
        order: "required|in:asc,desc",
      };

      const validation = await validate(request.all(), rules);

      if (validation.fails()) {
        return response.status(422).send(validation.messages()[0]);
      }

      const page = request.input("page");
      const limit = request.input("limit");
      const order = request.input("order");

      let query = RuleItem.query().with("Program").with("Arrangement");

      let data = await query.orderBy("id", order).paginate(page, limit);

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

      const findRuleItemExist = await RuleItem.query()
        .where("rule_id", rule_id)
        .where("program_id", program_id)
        .where("arrangement_id", arrangement_id)
        .first();

      if (findRuleItemExist) {
        return response.status(400).send({
          message: "Wewenang Sudah Ada",
        });
      }

      if (!findRule) {
        return response.status(404).send({
          message: "Rule Tidak Ditemukan",
        });
      }

      if (!findProgram) {
        return response.status(404).send({
          message: "Program Tidak Ditemukan",
        });
      }

      if (!findArrangement) {
        return response.status(404).send({
          message: "Tatanan Tidak Ditemukan",
        });
      }

      const createRule = await RuleItem.create({
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
        rule_item_id: "required|integer",
        rule_id: "required|integer",
        program_id: "required|integer",
        arrangement_id: "required|integer",
      };

      const validation = await validate(request.all(), rules);

      if (validation.fails()) {
        return response.status(422).send(validation.messages()[0]);
      }

      const rule_item_id = request.input("rule_item_id");
      const rule_id = request.input("rule_id");
      const program_id = request.input("program_id");
      const arrangement_id = request.input("arrangement_id");

      const findRuleItem = await RuleItem.find(rule_item_id);
      const findRule = await Rule.find(rule_id);
      const findProgram = await Program.find(program_id);
      const findArrangement = await Arrangement.find(arrangement_id);

      const findRuleItemExist = await RuleItem.find(rule_item_id);

      if (!findRuleItemExist) {
        return response.status(400).send({
          message: "Wewenang Tidak Ditemukan",
        });
      }

      if (!findRuleItem) {
        return response.status(404).send({
          message: "Wewenang Tidak Ditemukan",
        });
      }

      if (!findRule) {
        return response.status(404).send({
          message: "Rule Tidak Ditemukan",
        });
      }

      if (!findProgram) {
        return response.status(404).send({
          message: "Program Tidak Ditemukan",
        });
      }

      if (!findArrangement) {
        return response.status(404).send({
          message: "Tatanan Tidak Ditemukan",
        });
      }

      await RuleItem.query().where("id", rule_id).update({
        rule_id: rule_id,
        program_id: program_id,
        arrangement_id: arrangement_id,
      });

      let data = await RuleItem.find(rule_item_id);

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
        rule_item_id: "required|integer",
      };

      const validation = await validate(request.all(), rules);

      if (validation.fails()) {
        return response.status(422).send(validation.messages()[0]);
      }

      const rule_item_id = request.input("rule_item_id");

      const findRuleItem = await RuleItem.find(rule_item_id);

      if (!findRuleItem) {
        return response.status(404).send({
          message: "Wewenang Tidak Ditemukan",
        });
      }

      await RuleItem.query().where("id", rule_item_id).delete();

      return response.send({
        message: "Wewenang Berhasil Dihapus",
      });
    } catch (error) {
      console.log(error.message);
      return response.status(500).send(error.message);
    }
  }
}

module.exports = RuleItemController;
