"use strict";

const NewsComment = use("App/Models/NewsComment");
const News = use("App/Models/News");
const { validate } = use("Validator");

class NewsCommentController {
  async index({ request, response }) {
    try {
      const rules = {
        news_id: "required|integer",
        page: "required|integer",
        limit: "required|integer",
        order: "required|in:asc,desc",
        search: "string",
      };

      const validation = await validate(request.all(), rules);

      if (validation.fails()) {
        return response.status(422).send(validation.messages()[0]);
      }

      const news_id = request.input("news_id");
      const page = request.input("page");
      const limit = request.input("limit");
      const order = request.input("order");
      const search = request.input("search");

      const findNews = await News.find(news_id);

      if (!findNews) {
        return response.status(404).send({
          message: "news not found",
        });
      }

      let query = NewsComment.query();

      if (search) {
        query.where("comment", "like", `%${search}%`);
      }

      const data = await query
        .with("User")
        .where("news_id", news_id)
        .orderBy("id", order)
        .paginate(page, limit);

      return response.status(200).send(data);
    } catch (error) {
      console.log(error.message);
      return response.status(500).send(error.message);
    }
  }

  async get({ request, response }) {
    try {
      // Validate request
      const rules = {
        news_comment_id: "required|integer",
      };

      const validation = await validate(request.all(), rules);

      if (validation.fails()) {
        return response.status(422).send(validation.messages()[0]);
      }

      const news_comment_id = request.input("news_comment_id");

      let data = await NewsComment.query()
        .with("User")
        .where("id", news_comment_id)
        .first();

      if (!data) {
        return response.status(400).send({
          message: "news comment not found",
        });
      }

      return response.send(data);
    } catch (error) {
      console.log(error.message);
      return response.status(500).send(error.message);
    }
  }

  async create({ auth, request, response }) {
    try {
      // Validate request
      const rules = {
        news_id: "required|integer",
        comment: "required|string",
      };

      const validation = await validate(request.all(), rules);

      if (validation.fails()) {
        return response.status(422).send(validation.messages()[0]);
      }

      const comment = request.input("comment");
      const news_id = request.input("news_id");
      const user = await auth.getUser();

      const findNews = await News.find(news_id);

      if (!findNews) {
        return response.status(404).send({
          message: "news not found",
        });
      }

      let create = await NewsComment.create({
        user_id: user.id,
        news_id: news_id,
        comment: comment,
      });

      return response.send(create);
    } catch (error) {
      console.log(error.message);
      return response.status(500).send(error.message);
    }
  }

  async edit({ auth, request, response }) {
    try {
      // Validate request
      const rules = {
        news_comment_id: "required|integer",
        comment: "required|string",
      };

      const validation = await validate(request.all(), rules);

      if (validation.fails()) {
        return response.status(422).send(validation.messages()[0]);
      }

      const news_comment_id = request.input("news_comment_id");
      const comment = request.input("comment");
      const user = await auth.getUser();

      const findNewsComment = await NewsComment.query()
        .where("id", news_comment_id)
        .where("user_id", user.id)
        .first();

      if (!findNewsComment) {
        return response.status(404).send({
          message: "news comment not found",
        });
      }

      await NewsComment.query()
        .where("id", news_comment_id)
        .where("user_id", user.id)
        .update({
          comment: comment,
        });

      const updatedData = await NewsComment.query()
        .where("id", news_comment_id)
        .where("user_id", user.id)
        .first();

      return response.send(updatedData);
    } catch (error) {
      console.log(error.message);
      return response.status(500).send(error.message);
    }
  }

  async destroy({ auth, request, response }) {
    try {
      // Validate request
      const rules = {
        news_comment_id: "required|integer",
      };

      const validation = await validate(request.all(), rules);

      if (validation.fails()) {
        return response.status(422).send(validation.messages()[0]);
      }

      const news_comment_id = request.input("news_comment_id");
      const user = await auth.getUser();

      const findNewsComment = await NewsComment.query()
        .where("id", news_comment_id)
        .where("user_id", user.id)
        .first();

      if (!findNewsComment) {
        return response.status(404).send({
          message: "news comment not found",
        });
      }

      await NewsComment.query()
        .where("id", news_comment_id)
        .where("user_id", user.id)
        .delete();

      return response.send({
        message: "news comment deleted",
      });
    } catch (error) {
      console.log(error.message);
      return response.status(500).send(error.message);
    }
  }
}

module.exports = NewsCommentController;