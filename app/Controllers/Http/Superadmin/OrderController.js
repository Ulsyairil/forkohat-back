"use strict";

const Order = use("App/Models/Order");
const Moment = require("moment");
class OrderController {
  async index({ request, response }) {
    try {
      let data = await Order.query()
        .where("program_id", request.input("program_id"))
        .orderBy("id", "desc")
        .fetch();
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
        return response.status(404).send({
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
        return response.status(404).send({
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
        return response.status(404).send({
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
}

module.exports = OrderController;
