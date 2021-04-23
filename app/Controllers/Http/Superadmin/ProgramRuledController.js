"use strict";

const ProgramRuled = use("App/Models/ProgramRuled");
const Moment = use("moment");
const { validate } = use("Validator");

class ProgramRuledController {
  async index({ request, response }) {
    try {
      const rules = {
        rule_id: "required|number",
      };

      const validation = await validate(request.all(), rules);

      if (validation.fails()) {
        return response.status(422).send(validation.messages());
      }

      let data = await ProgramRuled.query()
        .with("rules")
        .with("programs")
        .where("rule_id", request.input("rule_id"))
        .fetch();

      return response.send(data);
    } catch (error) {
      console.log(error);
      return response.status(500).send(error);
    }
  }

  async create({ request, response }) {
    try {
      const rules = {
        rule_id: "required|number",
        program_id: "required|number",
      };

      const validation = await validate(request.all(), rules);

      if (validation.fails()) {
        return response.status(422).send(validation.messages());
      }

      let ruled = await ProgramRuled.create({
        rule_id: request.input("rule_id"),
        program_id: request.input("program_id"),
      });

      let data = await ProgramRuled.query()
        .with("rules")
        .with("programs")
        .where("id", ruled.id)
        .first();

      return response.send(data);
    } catch (error) {
      console.log(error);
      return response.status(500).send(error);
    }
  }

  async edit({ request, response }) {
    try {
      const rules = {
        id: "required|number",
        rule_id: "required|number",
        program_id: "required|number",
      };

      const validation = await validate(request.all(), rules);

      if (validation.fails()) {
        return response.status(422).send(validation.messages());
      }

      await ProgramRuled.query()
        .where("id", request.input("id"))
        .update({
          rule_id: request.input("rule_id"),
          program_id: request.input("program_id"),
        });

      let data = await ProgramRuled.query()
        .with("rules")
        .with("programs")
        .where("id", request.input("id"))
        .first();

      return response.send(data);
    } catch (error) {
      console.log(error);
      return response.status(500).send(error);
    }
  }

  async delete({ request, response }) {
    try {
      const rules = {
        id: "required|number",
      };

      const validation = await validate(request.all(), rules);

      if (validation.fails()) {
        return response.status(422).send(validation.messages());
      }

      await ProgramRuled.query().where("id", request.input("id")).delete();

      return response.send({
        message: "deleted",
      });
    } catch (error) {
      console.log(error);
      return response.status(500).send(error);
    }
  }
}

module.exports = ProgramRuledController;
