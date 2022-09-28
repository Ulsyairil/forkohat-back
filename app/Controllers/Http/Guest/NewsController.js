"use strict";

const News = use("App/Models/News");
const { validate } = use("Validator");

class NewsController {
  async index({ request, response }) {
    try {
      const rules = {
        page: "required|integer",
        limit: "required|integer",
        order: "required|in:asc,desc",
        search: "string",
        trash: "required|boolean",
      };

      const validation = await validate(request.all(), rules);

      if (validation.fails()) {
        return response.status(422).send(validation.messages()[0]);
      }

      const page = request.input("page");
      const limit = request.input("limit");
      const order = request.input("order");
      const search = request.input("search");

      // Get data
      let query = News.query().with("Author");

      if (search) {
        query
          .where("title", "like", `%${search}%`)
          .orWhere("content", "like", `%${search}%`);
      }

      let data = await query
        .whereNull("deleted_at")
        .orderBy("id", order)
        .paginate(page, limit);

      return response.send(data);
    } catch (error) {
      console.log(error.message);
      return response.status(500).send(error.message);
    }
  }

  async get({ request, response }) {
    try {
      const rules = {
        id: "required|integer",
      };

      const validation = await validate(request.all(), rules);

      if (validation.fails()) {
        return response.status(422).send(validation.messages()[0]);
      }

      const news_id = request.input("id");

      let data = await News.query().with("Author").where("id", news_id).first();

      if (!data) {
        return response.status(404).send({
          message: "News not found",
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
