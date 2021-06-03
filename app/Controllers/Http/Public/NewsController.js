"use strict";

const News = use("App/Models/News");

class NewsController {
  async index({ request, response }) {
    try {
      let query = News.query()
        .with("users", (builder) => {
          builder.select("id", "name").where("deleted_at", null);
        })
        .with("newsFiles", (builder) => {
          builder.where("type", "banner").where("deleted_at", null);
        });

      console.log(request.input("search"));

      if (request.input("search") != null) {
        query
          .where("title", "like", `%${request.input("search")}%`)
          .orWhere("content", "like", `%${request.input("search")}%`);
      }

      let data = await query
        .where("deleted_at", null)
        .orderBy("id", "desc")
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
      let data = await News.query()
        .with("users", (builder) => {
          builder.select("id", "name").where("deleted_at", null);
        })
        .with("newsFiles", (builder) => {
          builder.where("deleted_at", null);
        })
        .where("id", request.input("id"))
        .where("deleted_at", null)
        .first();
      console.log(data);

      if (data == null) {
        return response.status(404).send({
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

module.exports = NewsController;
