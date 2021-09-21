"use strict";

const Order = use("App/Models/Order");
const Moment = require("moment");
const OrderStuff = use("App/Models/OrderStuff");
const Helpers = use("Helpers");
const fs = use("fs");
const path = use("path");
const removeFile = Helpers.promisify(fs.unlink);
const OrderFile = use("App/Models/OrderFile");

class OrderController {
  async index({ request, response }) {
    try {
      let data = await Order.query().orderBy("id", "desc").fetch();
      console.log(data);

      return response.send(data);
    } catch (error) {
      console.log(error.message);
      return response.status(500).send(error.message);
    }
  }

  async get({ request, response }) {
    try {
      let data = await Order.query()
        .with("programs")
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
      let create = await Order.create({
        program_id: request.input("program_id"),
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
      let find = await Order.find(request.input("id"));

      if (!find) {
        return response.status(400).send({
          message: "not found",
        });
      }

      await Order.query()
        .where("id", request.input("id"))
        .update({
          program_id: request.input("program_id"),
          name: request.input("name"),
          description: request.input("description"),
        });

      let data = await Order.query()
        .with("programs")
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
      let find = await Order.find(request.input("id"));

      if (!find) {
        return response.status(400).send({
          message: "not found",
        });
      }

      await Order.query().where("id", request.input("id")).update({
        deleted_at: Moment.now(),
      });

      let data = await Order.query()
        .with("programs")
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
      let find = await Order.find(request.input("id"));

      if (!find) {
        return response.status(400).send({
          message: "not found",
        });
      }

      await Order.query().where("id", request.input("id")).update({
        deleted_at: null,
      });

      let data = await Order.query()
        .with("programs")
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
      let find = await Order.find(request.input("id"));

      if (!find) {
        return response.status(400).send({
          message: "not found",
        });
      }

      let queryFindOrderStuff = await OrderStuff.query()
        .where("order_id", find.id)
        .fetch();
      let findOrderStuff = queryFindOrderStuff.toJSON();

      findOrderStuff.forEach(async (value) => {
        let queryFindOrderFile = await OrderFile.query()
          .where("order_stuff_id", value.id)
          .fetch();

        let findOrderFile = queryFindOrderFile.toJSON();

        findOrderFile.forEach((item) => {
          if (findFile) {
            removeFile(
              path.join(Helpers.resourcesPath("uploads/orders"), item.name)
            );
          }
        });

        await OrderFile.query().where("order_stuff_id", value.id).delete();
      });

      await OrderStuff.query().where("order_id", find.id).delete();
      await Order.query().where("id", request.input("id")).delete();

      return response.send({
        message: "deleted",
      });
    } catch (error) {
      console.log(error.message);
      return response.status(500).send(error.message);
    }
  }
}

module.exports = OrderController;
