"use strict";

const FaqTopic = use("App/Models/FaqTopic");
const Moment = use("moment");
const { validateAll } = use("Validator");

class FaqTopicController {
  async index({ request, response }) {
    try {
      const rules = {
        faq_id: "required|number",
      };

      const validation = await validateAll(request.all(), rules);

      if (validation.fails()) {
        return response.status(422).send(validation.messages());
      }

      let data = await FaqTopic.query()
        .where("faq_id", request.input("faq_id"))
        .fetch();

      return response.send(data);
    } catch (error) {
      console.log(error);
      return response.status(500).send(error);
    }
  }

  async create({ request, response }) {
    try {
      const rules = {
        faq_id: "required|number",
        title: "required|string",
        description: "required|string",
      };

      const validation = await validateAll(request.all(), rules);

      if (validation.fails()) {
        return response.status(422).send(validation.messages());
      }

      let create = await FaqTopic.create({
        faq_id: request.input("faq_id"),
        title: request.input("title"),
        description: request.input("description"),
      });

      return response.send(create);
    } catch (error) {
      console.log(error);
      return response.status(500).send(error);
    }
  }

  async edit({ request, response }) {
    try {
      const rules = {
        id: "required|number",
        faq_id: "required|number",
        title: "required|string",
        description: "required|string",
      };

      const validation = await validateAll(request.all(), rules);

      if (validation.fails()) {
        return response.status(422).send(validation.messages());
      }

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
        return response.status(404).send({
          message: "not found",
        });
      }

      return response.send(data);
    } catch (error) {
      console.log(error);
      return response.status(500).send(error);
    }
  }

  async dump({ request, response }) {
    try {
      const rules = {
        id: "required|number",
      };

      const validation = await validateAll(request.all(), rules);

      if (validation.fails()) {
        return response.status(422).send(validation.messages());
      }

      let update = await FaqTopic.query()
        .where("id", request.input("id"))
        .update({
          deleted_at: Moment.now(),
        });

      let data = await FaqTopic.query()
        .where("id", request.input("id"))
        .first();

      if (!data) {
        return response.status(404).send({
          message: "not found",
        });
      }

      return response.send(data);
    } catch (error) {
      console.log(error);
      return response.status(500).send(error);
    }
  }

  async restore({ request, response }) {
    try {
      const rules = {
        id: "required|number",
      };

      const validation = await validateAll(request.all(), rules);

      if (validation.fails()) {
        return response.status(422).send(validation.messages());
      }

      let update = await FaqTopic.query()
        .where("id", request.input("id"))
        .update({
          deleted_at: null,
        });

      let data = await FaqTopic.query()
        .where("id", request.input("id"))
        .first();

      if (!data) {
        return response.status(404).send({
          message: "not found",
        });
      }

      return response.send(data);
    } catch (error) {
      console.log(error);
      return response.status(500).send(error);
    }
  }

  async delete({ request, response }) {
    try {
      const rules = {
        id: "required|number",
      };

      const validation = await validateAll(request.all(), rules);

      if (validation.fails()) {
        return response.status(422).send(validation.messages());
      }

      let data = await FaqTopic.query()
        .where("id", request.input("id"))
        .first();

      if (!data) {
        return response.status(404).send({
          message: "not found",
        });
      }

      await FaqTopic.query().where("id", request.input("id")).delete();

      return response.send({
        message: "deleted",
      });
    } catch (error) {
      console.log(error);
      return response.status(500).send(error);
    }
  }
}

module.exports = FaqTopicController;
