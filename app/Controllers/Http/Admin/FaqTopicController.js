"use strict";

const FaqTopic = use("App/Models/FaqTopic");
const Faq = use("App/Models/Faq");
const { validate } = use("Validator");

class FaqTopicController {
  async index({ request, response }) {
    try {
      // Validate request
      const rules = {
        faq_id: "required|integer",
        page: "required|integer",
        limit: "required|integer",
        order: "required|in:asc,desc",
        search: "string",
      };

      const validation = await validate(request.all(), rules);

      if (validation.fails()) {
        return response.status(422).send(validation.messages()[0]);
      }

      const faq_id = request.input("faq_id");
      const page = request.input("page");
      const limit = request.input("limit");
      const order = request.input("order");
      const search = request.input("search");

      const findFaq = await Faq.find(faq_id);

      if (!findFaq) {
        return response.status(404).send({
          message: "FAQ not found",
        });
      }

      let query = FaqTopic.query();

      if (search) {
        query
          .where("title", "like", `%${search}%`)
          .orWhere("description", "like", `%${search}%`);
      }

      const data = await query
        .where("faq_id", faq_id)
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
      // Validate request
      const rules = {
        id: "required|integer",
      };

      const validation = await validate(request.all(), rules);

      if (validation.fails()) {
        return response.status(422).send(validation.messages()[0]);
      }

      const faq_topic_id = request.input("id");

      let data = await FaqTopic.find(faq_topic_id);

      if (!data) {
        return response.status(404).send({
          message: "Topic FAQ not found",
        });
      }

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
        faq_id: "required|integer",
        title: "required|string",
        description: "required|string",
      };

      const validation = await validate(request.all(), rules);

      if (validation.fails()) {
        return response.status(422).send(validation.messages()[0]);
      }

      const faq_id = request.input("faq_id");
      const title = request.input("title");
      const description = request.input("description");

      const findFaq = await Faq.find(faq_id);

      if (!findFaq) {
        return response.status(404).send({
          message: "FAQ not found",
        });
      }

      let create = await FaqTopic.create({
        faq_id: faq_id,
        title: title,
        description: description,
      });

      return response.send(create);
    } catch (error) {
      console.log(error.message);
      return response.status(500).send(error.message);
    }
  }

  async edit({ request, response }) {
    try {
      // Validate request
      const rules = {
        id: "required|integer",
        title: "required|string",
        description: "string",
      };

      const validation = await validate(request.all(), rules);

      if (validation.fails()) {
        return response.status(422).send(validation.messages()[0]);
      }

      const faq_topic_id = request.input("id");
      const title = request.input("title");
      const description = request.input("description");

      let findData = await FaqTopic.find(faq_topic_id);

      if (!findData) {
        return response.status(404).send({
          message: "Topic FAQ not found",
        });
      }

      await FaqTopic.query().where("id", faq_topic_id).update({
        title: title,
        description: description,
      });

      let data = await FaqTopic.find(faq_topic_id);

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
        id: "required|integer",
      };

      const validation = await validate(request.all(), rules);

      if (validation.fails()) {
        return response.status(422).send(validation.messages()[0]);
      }

      const faq_topic_id = request.input("id");

      let findData = await FaqTopic.find(faq_topic_id);

      if (!findData) {
        return response.status(404).send({
          message: "Topic FAQ not found",
        });
      }

      await FaqTopic.query().where("id", faq_topic_id).delete();

      return response.send({
        message: "Topic FAQ deleted",
      });
    } catch (error) {
      console.log(error.message);
      return response.status(500).send(error.message);
    }
  }
}

module.exports = FaqTopicController;
