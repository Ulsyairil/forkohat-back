"use strict";

const Order = use("App/Models/Order");
const OrderStuff = use("App/Models/OrderStuff");
const ProgramRuled = use("App/Models/ProgramRuled");
const Moment = require("moment");
const { validateAll } = use("Validator");
const Helpers = use("Helpers");
const fs = use("fs");
const path = use("path");
const removeFile = Helpers.promisify(fs.unlink);
const OrderFile = use("App/Models/OrderFile");

class OrderStuffController {
  async index({ auth, request, response }) {
    try {
      const rules = {
        order_id: "required|number",
        page: "required|number",
        limit: "required|number",
        search: "string",
        showed: "required|in:all,private,member,public",
        trash: "required|boolean",
      };

      const validation = await validateAll(request.all(), rules);

      if (validation.fails()) {
        return response.status(422).send(validation.messages());
      }

      let user = await auth.getUser();

      let query = OrderStuff.query()
        .with("users")
        .with("orderStuffFiles", (builder) => {
          builder.where("deleted_at", null).orderBy("id", "desc");
        });

      if (request.input("search") != null) {
        query
          .where("name", "like", `%${request.input("search")}%`)
          .orWhere("description", "like", `%${request.input("search")}%`);
      }

      if (request.input("showed") == "private") {
        query
          .where("showed", request.input("showed"))
          .where("user_id", user.id);
      }

      if (request.input("showed") == "member") {
        query.where("showed", "member");
      }

      if (request.input("showed") == "public") {
        query.where("showed", "public");
      }

      if (request.input("trash") == 0) {
        query.whereNull("deleted_at");
      }

      if (request.input("trash") == 1) {
        query.whereNotNull("deleted_at");
      }

      let data = await query
        .where("order_id", request.input("order_id"))
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
        .with("users")
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

  async create({ auth, request, response }) {
    try {
      let user = await auth.getUser();

      let create = await OrderStuff.create({
        order_id: request.input("order_id"),
        name: request.input("name"),
        description: request.input("description"),
        showed: request.input("showed"),
        user_id: user.id,
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
        return response.status(400).send({
          message: "not found",
        });
      }

      await OrderStuff.query()
        .where("id", request.input("id"))
        .update({
          order_id: request.input("order_id"),
          name: request.input("name"),
          description: request.input("description"),
          showed: request.input("showed"),
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
        return response.status(400).send({
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
        return response.status(400).send({
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

  async delete({ request, response }) {
    try {
      let find = await OrderStuff.find(request.input("id"));

      if (!find) {
        return response.status(400).send({
          message: "not found",
        });
      }

      let queryFindOrderFile = await OrderFile.query()
        .where("order_stuff_id", find.id)
        .fetch();

      let findOrderFile = queryFindOrderFile.toJSON();

      findOrderFile.forEach((value) => {
        removeFile(
          path.join(Helpers.resourcesPath("uploads/orders"), value.name)
        );
      });

      await OrderFile.query().where("order_stuff_id", find.id).delete();
      await OrderStuff.query().where("id", request.input("id")).delete();

      return response.send({
        message: "deleted",
      });
    } catch (error) {
      console.log(error.message);
      return response.status(500).send(error.message);
    }
  }
}

module.exports = OrderStuffController;
