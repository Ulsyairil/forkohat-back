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
}

module.exports = ProgramRuledController;
