"use strict";

const Order = use("App/Models/Order");
const OrderStuff = use("App/Models/OrderStuff");
const ProgramRuled = use("App/Models/ProgramRuled");
const Moment = require("moment");
const { validateAll } = use("Validator");

class OrderStuffController {
  async index({ auth, request, response }) {
    try {
      const rules = {
        order_id: "required|number",
        page: "required|number",
        limit: "required|number",
        search: "string",
      };

      const validation = await validateAll(request.all(), rules);

      if (validation.fails()) {
        return response.status(422).send(validation.messages());
      }

      let query = OrderStuff.query().with("orderStuffFiles", (builder) => {
        builder.where("deleted_at", null).orderBy("id", "desc");
      });

      if (request.input("search") != null) {
        query
          .where("name", "like", `%${request.input("search")}%`)
          .orWhere("description", "like", `%${request.input("search")}%`);
      }

      let data = await query
        .where("order_id", request.input("order_id"))
        .where("deleted_at", null)
        .orderBy("id", "asc")
        .paginate(request.input("page"), request.input("limit"));

      return response.send(data);
    } catch (error) {
      console.log(error.message);
      return response.status(500).send(error.message);
    }
  }

  async showOrder({ auth, request, response }) {
    try {
      let user = await auth.getUser();

      let findProgramRuled = await ProgramRuled.query()
        .where("rule_id", user.rule_id)
        .fetch();

      console.log(findProgramRuled.toJSON());

      let convertProgramRuled = findProgramRuled.toJSON();

      let data = Order.query().where("deleted_at", null);

      convertProgramRuled.forEach((value) => {
        data = data.where("program_id", value.program_id);
      });

      data = await data.fetch();

      return response.send(data);
    } catch (error) {
      console.log(error.message);
      return response.status(500).send(error.message);
    }
  }

  async get({ request, response }) {
    try {
      let data = await OrderStuff.query()
        .with("orders")
        .where("id", request.input("id"))
        .first();

      if (!data) {
        return response.send({
          message: "not found",
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
      let create = await OrderStuff.create({
        order_id: request.input("order_id"),
        name: request.input("name"),
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
      let find = await OrderStuff.find(request.input("id"));

      if (!find) {
        return response.status(404).send({
          message: "not found",
        });
      }

      await OrderStuff.query()
        .where("id", request.input("id"))
        .update({
          order_id: request.input("order_id"),
          name: request.input("name"),
          description: request.input("description"),
        });

      let data = await OrderStuff.query()
        .with("orders")
        .where("id", request.input("id"))
        .first();

      return response.send(data);
    } catch (error) {
      console.log(error.message);
      return response.status(500).send(error.message);
    }
  }

  async dump({ request, response }) {
    try {
      let find = await OrderStuff.find(request.input("id"));

      if (!find) {
        return response.status(404).send({
          message: "not found",
        });
      }

      await OrderStuff.query().where("id", request.input("id")).update({
        deleted_at: Moment.now(),
      });

      let data = await OrderStuff.query()
        .with("orders")
        .where("id", request.input("id"))
        .first();

      return response.send(data);
    } catch (error) {
      console.log(error.message);
      return response.status(500).send(error.message);
    }
  }

  async restore({ request, response }) {
    try {
      let find = await OrderStuff.find(request.input("id"));

      if (!find) {
        return response.status(404).send({
          message: "not found",
        });
      }

      await OrderStuff.query().where("id", request.input("id")).update({
        deleted_at: null,
      });

      let data = await OrderStuff.query()
        .with("orders")
        .where("id", request.input("id"))
        .first();

      return response.send(data);
    } catch (error) {
      console.log(error.message);
      return response.status(500).send(error.message);
    }
  }
}

module.exports = OrderStuffController;
