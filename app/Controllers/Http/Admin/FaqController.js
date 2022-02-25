"use strict";

const Faq = use("App/Models/Faq");
const FaqTopic = use("App/Models/FaqTopic");
const Moment = require("moment");
const { validate } = use("Validator");

class FaqController {
  async index({ request, response }) {
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

      const page = request.input("page");
      const limit = request.input("limit");
      const order = request.input("order");
      const search = request.input("search");

      let query = Faq.query();

      if (search) {
        query.where("name", "like", `%${search}%`);
      }

      const data = await query.orderBy("id", order).paginate(page, limit);

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
        faq_id: "required|integer",
      };

      const validation = await validate(request.all(), rules);

      if (validation.fails()) {
        return response.status(422).send(validation.messages()[0]);
      }

      const faq_id = request.input("faq_id");

      let data = await Faq.find(faq_id);

      if (!data) {
        return response.status(404).send({
          message: "FAQ Tidak Ditemukan",
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
        name: "required|string",
      };

      const messages = {
        "name.required": "Judul FAQ Harus Diisi",
      };

      const validation = await validate(request.all(), rules, messages);

      if (validation.fails()) {
        return response.status(422).send(validation.messages()[0]);
      }

      const name = request.input("name");

      let create = await Faq.create({
        name: name,
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
        faq_id: "required|integer",
        name: "required|string",
      };

      const validation = await validate(request.all(), rules);

      if (validation.fails()) {
        return response.status(422).send(validation.messages()[0]);
      }

      const faq_id = request.input("faq_id");
      const name = request.input("name");

      let findData = await Faq.find(faq_id);

      if (!findData) {
        return response.status(404).send({
          message: "FAQ Tidak Ditemukan",
        });
      }

      await Faq.query().where("id", faq_id).update({
        name: name,
      });

      let data = await Faq.find(faq_id);

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
        faq_id: "required|integer",
      };

      const validation = await validate(request.all(), rules);

      if (validation.fails()) {
        return response.status(422).send(validation.messages()[0]);
      }

      const faq_id = request.input("faq_id");

      let findData = await Faq.find(faq_id);

      if (!findData) {
        return response.status(404).send({
          message: "FAQ Tidak Ditemukan",
        });
      }

      await FaqTopic.query().where("faq_id", faq_id).delete();

      await Faq.query().where("id", faq_id).delete();

      return response.send({
        message: "FAQ Berhasil Dihapus",
      });
    } catch (error) {
      console.log(error.message);
      return response.status(500).send(error.message);
    }
  }
}

module.exports = FaqController;
