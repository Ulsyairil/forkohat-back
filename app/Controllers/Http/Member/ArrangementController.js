"use strict";

const Arrangement = use("App/Models/Arrangement");
const Program = use("App/Models/Program");
const { validate } = use("Validator");

class ArrangementController {
  async index({ auth, request, response }) {
    try {
      const rules = {
        program_id: "required|integer",
        page: "required|integer",
        limit: "required|integer",
        order: "required|in:asc,desc",
        search: "string",
      };

      const validation = await validate(request.all(), rules);

      if (validation.fails()) {
        return response.status(422).send(validation.messages()[0]);
      }

      const program_id = request.input("program_id");
      const page = request.input("page");
      const limit = request.input("limit");
      const order = request.input("order");
      const search = request.input("search");

      const findProgram = await Program.find(program_id);

      if (!findProgram) {
        return response.status(404).send({
          message: "Program not found",
        });
      }

      const userLogged = await auth.getUser();
      let query = Arrangement.query();

      if (search) {
        query.with("Permission", (builder) => {
          builder.where("rule_id", userLogged.rule_id);
        });
      }

      const data = await query
        .where("program_id", program_id)
        .orderBy("id", order)
        .paginate(page, limit);

      return response.status(200).send(data);
    } catch (error) {
      console.log(error.message);
      return response.status(500).send(error.message);
    }
  }
}

module.exports = ArrangementController;
