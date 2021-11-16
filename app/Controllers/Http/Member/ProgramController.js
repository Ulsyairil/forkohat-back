"use strict";

const RuleItem = use("App/Models/RuleItem");
const { validate } = use("Validator");

class ProgramController {
  async index({ auth, request, response }) {
    try {
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

      const userLogged = await auth.getUser();
      let query = RuleItem.query().with("Program");

      if (search) {
        query.with("Program", (builder) => {
          builder.where("title", "like", `%${search}%`);
        });
      }

      const data = await query
        .select("rule_id", "program_id")
        .where("rule_id", userLogged.rule_id)
        .groupBy("program_id")
        .orderBy("program_id", order)
        .paginate(page, limit);

      return response.status(200).send(data);
    } catch (error) {
      console.log(error.message);
      return response.status(500).send(error.message);
    }
  }
}

module.exports = ProgramController;
