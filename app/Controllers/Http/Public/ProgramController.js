"use strict";

const Program = use("App/Models/Program");

class ProgramController {
  async index({ request, response }) {
    try {
      let query = Program.query().with("programFiles");

      console.log(request.input("search"));

      if (request.input("search") != null) {
        query
          .where("name", "like", `%${request.input("search")}%`)
          .orWhere("description", "like", `%${request.input("search")}%`);
      }

      let data = await query
        .where("deleted_at", null)
        .orderBy("id", "asc")
        .paginate(request.input("page"), request.input("limit"));
      console.log(data.toJSON());

      return response.send(data.toJSON());
    } catch (error) {
      console.log(error.message);
      return response.status(500).send(error.message);
    }
  }

  async get({ request, response }) {
    try {
      let data = await Program.query()
        .with("programFiles")
        .where("id", request.input("id"))
        .where("deleted_at", null)
        .first();
      console.log(data);

      if (data == null) {
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
}

module.exports = ProgramController;
