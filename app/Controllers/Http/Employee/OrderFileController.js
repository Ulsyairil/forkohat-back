"use strict";

const Helpers = use("Helpers");
const fs = use("fs");
const path = use("path");
const removeFile = Helpers.promisify(fs.unlink);
const OrderFile = use("App/Models/OrderFile");
const RandomString = require("randomstring");
const Moment = require("moment");
const voca = require("voca");

class OrderFileController {
  async index({ request, response }) {
    try {
      let data = await OrderFile.query()
        .where("order_stuff_id", request.input("order_stuff_id"))
        .orderBy("id", "asc")
        .first();

      return response.send(data);
    } catch (error) {
      console.log(error.message);
      return response.status(500).send(error.message);
    }
  }

  async create({ request, response }) {
    try {
      let inputFile = request.file("file");
      let random = RandomString.generate({
        capitalization: "lowercase",
      });

      let fileName = `${voca.snakeCase(
        inputFile.clientName.split(".").slice(0, -1).join(".")
      )}_${random}.${inputFile.extname}`;

      await inputFile.move(Helpers.resourcesPath("uploads/orders"), {
        name: fileName,
      });

      if (!inputFile.moved()) {
        return response.status(422).send(inputFile.errors());
      }

      let create = await OrderFile.create({
        order_stuff_id: request.input("order_stuff_id"),
        name: fileName,
        mime: inputFile.extname,
        path: Helpers.resourcesPath("uploads/orders"),
        url: `/api/v1/file/${inputFile.extname}/${fileName}`,
      });

      return response.send(create);
    } catch (error) {
      console.log(error.message);
      return response.status(500).send(error.message);
    }
  }

  async edit({ request, response }) {
    try {
      let random = RandomString.generate({
        capitalization: "lowercase",
      });

      let inputFile = request.file("file");

      let findFile = await OrderFile.query()
        .where("id", request.input("id"))
        .first();

      // Delete file and data if exists
      if (findFile) {
        removeFile(
          path.join(Helpers.resourcesPath("uploads/orders"), findFile.name)
        );
      }

      let fileName = `${voca.snakeCase(
        inputFile.clientName.split(".").slice(0, -1).join(".")
      )}_${random}.${inputFile.extname}`;

      await inputFile.move(Helpers.resourcesPath("uploads/orders"), {
        name: fileName,
      });

      if (!inputFile.moved()) {
        return response.status(422).send(inputFile.errors());
      }

      await OrderFile.query()
        .where("id", request.input("id"))
        .update({
          name: fileName,
          mime: inputFile.extname,
          url: `/api/v1/file/${inputFile.extname}/${fileName}`,
        });

      let data = await OrderFile.query()
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
      await OrderFile.query().where("id", request.input("id")).update({
        deleted_at: Moment.now(),
      });

      let data = await OrderFile.query()
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
      await OrderFile.query().where("id", request.input("id")).update({
        deleted_at: null,
      });

      let data = await OrderFile.query()
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
      let findFile = await OrderFile.query()
        .where("id", request.input("id"))
        .first();

      // Delete file and data if exists
      if (findFile) {
        removeFile(
          path.join(Helpers.resourcesPath("uploads/orders"), findFile.name)
        );
      }

      await OrderFile.query().where("id", findFile.id).delete();

      return response.send({
        message: "deleted",
      });
    } catch (error) {
      console.log(error.message);
      return response.status(500).send(error.message);
    }
  }
}

module.exports = OrderFileController;
