"use strict";

const Faq = use("App/Models/Faq");
const FaqTopic = use("App/Models/FaqTopic");
const Moment = use("moment");
const { validateAll } = use("Validator");

class FaqController {
  async index({ request, response }) {
    try {
      let queryTotalData = await Faq.query().count("* as total");

      let totalData = queryTotalData[0].total;
      console.log(totalData);

      let queryTotalFilteredData = Faq.query();

      if (request.input("search").value != "") {
        queryTotalFilteredData
          .where("name", "like", `%${request.input("search").value}%`)
          .orWhere("created_at", "like", `%${request.input("search").value}%`)
          .orWhere("updated_at", "like", `%${request.input("search").value}%`)
          .orWhere("deleted_at", "like", `%${request.input("search").value}%`);
      }

      let count = await queryTotalFilteredData.count("* as total");
      let totalFiltered = count[0].total;

      let getData = Faq.query();

      if (request.input("search").value != "") {
        getData
          .where("name", "like", `%${request.input("search").value}%`)
          .orWhere("created_at", "like", `%${request.input("search").value}%`)
          .orWhere("updated_at", "like", `%${request.input("search").value}%`)
          .orWhere("deleted_at", "like", `%${request.input("search").value}%`);
      }

      request.input("order").forEach((value) => {
        getData.orderBy(value.column, value.dir);
      });

      getData.offset(request.input("start")).limit(request.input("length"));

      let data = await getData.fetch();
      console.log(data);

      return response.send({
        draw: Number(request.input("draw")),
        recordsTotal: totalData,
        recordsFiltered: totalFiltered,
        data: data,
      });
    } catch (error) {
      console.log(error);
      return response.status(500).send(error);
    }
  }

  async get({ request, response }) {
    try {
      let data = await Faq.find(request.input("faq_id"));

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

  async create({ request, response }) {
    try {
      let create = await Faq.create({
        name: request.input("name"),
      });

      return response.send(create);
    } catch (error) {
      console.log(error);
      return response.status(500).send(error);
    }
  }

  async edit({ request, response }) {
    try {
      await Faq.query()
        .where("id", request.input("faq_id"))
        .update({
          name: request.input("name"),
        });

      let data = await Faq.find(request.input("faq_id"));

      return response.send(data);
    } catch (error) {
      console.log(error);
      return response.status(500).send(error);
    }
  }

  async dump({ request, response }) {
    try {
      await Faq.query().where("id", request.input("faq_id")).update({
        deleted_at: Moment.now(),
      });

      let data = await Faq.find(request.input("faq_id"));

      return response.send(data);
    } catch (error) {
      console.log(error);
      return response.status(500).send(error);
    }
  }

  async restore({ request, response }) {
    try {
      await Faq.query().where("id", request.input("faq_id")).update({
        deleted_at: null,
      });

      let data = await Faq.find(request.input("faq_id"));

      return response.send(data);
    } catch (error) {
      console.log(error);
      return response.status(500).send(error);
    }
  }

  async delete({ request, response }) {
    try {
      await FaqTopic.query().where("faq_id", request.input("faq_id")).delete();

      await Faq.query().where("id", request.input("faq_id")).delete();

      return response.send({
        message: "deleted",
      });
    } catch (error) {
      console.log(error);
      return response.status(500).send(error);
    }
  }
}

module.exports = FaqController;
