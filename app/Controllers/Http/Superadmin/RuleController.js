"use strict";

const Rule = use("App/Models/Rule");
const Moment = use("moment");
const { validateAll } = use("Validator");

class RuleController {
  async index({ request, response }) {
    try {
      let queryTotalData = await Rule.query().count("* as total");

      let totalData = queryTotalData[0].total;
      console.log(totalData);

      let queryTotalFilteredData = Rule.query();

      if (request.input("search").value != "") {
        queryTotalFilteredData
          .where("rule", "like", `%${request.input("search").value}%`)
          .orWhere("created_at", "like", `%${request.input("search").value}%`)
          .orWhere("updated_at", "like", `%${request.input("search").value}%`)
          .orWhere("deleted_at", "like", `%${request.input("search").value}%`);
      }

      let count = await queryTotalFilteredData.count("* as total");
      let totalFiltered = count[0].total;

      let getData = Rule.query();

      if (request.input("search").value != "") {
        getData
          .where("rule", "like", `%${request.input("search").value}%`)
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
      let data = await Rule.find(request.input("rule_id"));

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
      let rule = await Rule.create({
        rule: request.input("rule"),
      });

      return response.send(rule);
    } catch (error) {
      console.log(error);
      return response.status(500).send(error);
    }
  }

  async edit({ request, response }) {
    try {
      await Rule.query()
        .where("id", request.input("rule_id"))
        .update({
          rule: request.input("rule"),
        });

      let data = await Rule.find(request.input("rule_id"));

      return response.send(data);
    } catch (error) {
      console.log(error);
      return response.status(500).send(error);
    }
  }

  async dump({ request, response }) {
    try {
      await Rule.query().where("id", request.input("rule_id")).update({
        deleted_at: Moment.now(),
      });

      let data = await Rule.find(request.input("rule_id"));

      return response.send(data);
    } catch (error) {
      console.log(error);
      return response.status(500).send(error);
    }
  }

  async restore({ request, response }) {
    try {
      await Rule.query().where("id", request.input("rule_id")).update({
        deleted_at: null,
      });

      let data = await Rule.find(request.input("rule_id"));

      return response.send(data);
    } catch (error) {
      console.log(error);
      return response.status(500).send(error);
    }
  }
}

module.exports = RuleController;
