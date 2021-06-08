"use strict";

const OrderStuff = use("App/Models/OrderStuff");
const Moment = require("moment");
const Helpers = use("Helpers");
const fs = use("fs");
const path = use("path");
const removeFile = Helpers.promisify(fs.unlink);
const OrderFile = use("App/Models/OrderFile");

class OrderStuffController {
  async index({ request, response }) {
    try {
      let data = await OrderStuff.query()
        .where("order_id", request.input("order_id"))
        .fetch();

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

  async delete({ request, response }) {
    try {
      let find = await OrderStuff.find(request.input("id"));

      if (!find) {
        return response.status(404).send({
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
