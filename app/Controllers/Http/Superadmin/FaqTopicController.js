"use strict";

const FaqTopic = use("App/Models/FaqTopic");
const Moment = require("moment");

class FaqTopicController {
  async index({ request, response }) {
    try {
      let data = await FaqTopic.query()
        .where("faq_id", request.input("faq_id"))
        .fetch();

      return response.send(data);
    } catch (error) {
      console.log(error.message);
      return response.status(500).send(error.message);
    }
  }

  async create({ request, response }) {
    try {
      let create = await FaqTopic.create({
        faq_id: request.input("faq_id"),
        title: request.input("title"),
        description: request.input("description"),
      });

      return response.send(create);
    } catch (error) {
      console.log(error.message);
      return response.status(500).send(error.message);
    }
  }

  async edit({ request, response }) {
    try {
      await FaqTopic.query()
        .where("id", request.input("id"))
        .update({
          faq_id: request.input("faq_id"),
          title: request.input("title"),
          description: request.input("description"),
        });

      let data = await FaqTopic.query()
        .where("id", request.input("id"))
        .first();

      if (!data) {
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

  async dump({ request, response }) {
    try {
      let update = await FaqTopic.query()
        .where("id", request.input("id"))
        .update({
          deleted_at: Moment.now(),
        });

      let data = await FaqTopic.query()
        .where("id", request.input("id"))
        .first();

      if (!data) {
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

  async restore({ request, response }) {
    try {
      let update = await FaqTopic.query()
        .where("id", request.input("id"))
        .update({
          deleted_at: null,
        });

      let data = await FaqTopic.query()
        .where("id", request.input("id"))
        .first();

      if (!data) {
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

  async delete({ request, response }) {
    try {
      let data = await FaqTopic.query()
        .where("id", request.input("id"))
        .first();

      if (!data) {
        return response.status(400).send({
          message: "not found",
        });
      }

      await FaqTopic.query().where("id", request.input("id")).delete();

      return response.send({
        message: "deleted",
      });
    } catch (error) {
      console.log(error.message);
      return response.status(500).send(error.message);
    }
  }
}

module.exports = FaqTopicController;