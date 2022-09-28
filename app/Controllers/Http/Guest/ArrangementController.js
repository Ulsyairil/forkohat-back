"use strict";

const { validate } = use("Validator");
const Program = use("App/Models/Program");
const Arrangement = use("App/Models/Arrangement");

class ArrangementController {
  async index({ request, response }) {
    try {
      // Validate request
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

      // All input
      const program_id = request.input("program_id");
      const page = request.input("page");
      const limit = request.input("limit");
      const order = request.input("order");
      const search = request.input("search");

      // Find program data
      let findProgram = await Program.find(program_id);

      // Check program exist
      if (!findProgram) {
        return response.status(404).send({
          message: "Program Tidak Ditemukan",
        });
      }

      // Arrangement query
      let query = Arrangement.query();

      // Search arrangement query
      if (search) {
        query
          .where("title", "like", `%${search}%`)
          .orWhere("description", "like", `%${search}%`);
      }

      // Get arrangement data
      const data = await query
        .where("program_id", program_id)
        .orderBy("id", order)
        .paginate(page, limit);
      console.log(data);

      return response.status(200).send(data);
    } catch (error) {
      console.log(error.message);
      return response.status(500).send(error.message);
    }
  }

  async indexGeneral({ request, response }) {
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

      // All input
      const page = request.input("page");
      const limit = request.input("limit");
      const order = request.input("order");
      const search = request.input("search");

      // Arrangement query
      let query = Arrangement.query();

      // Search arrangement query
      if (search) {
        query
          .where("title", "like", `%${search}%`)
          .orWhere("description", "like", `%${search}%`);
      }

      // Get arrangement data
      const data = await query
        .where("program_id", program_id)
        .orderBy("id", order)
        .paginate(page, limit);
      console.log(data);

      return response.status(200).send(data);
    } catch (error) {
      console.log(error.message);
      return response.status(500).send(error.message);
    }
  }
}

module.exports = ArrangementController;
