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
        .orderBy("page", "asc")
        .fetch();

      return response.send(data);
    } catch (error) {
      console.log(error.message);
      return response.status(500).send(error.message);
    }
  }

  async checkImageRequest({ request, response }) {
    try {
      let inputImage = request.file("image", {
        size: "5mb",
        extnames: ["png", "jpg", "jpeg"],
      });

      if (!inputImage) {
        return response.status(422).send(inputImage.errors());
      }

      return response.send({
        message: "success",
      });
    } catch (error) {
      console.log(error.message);
      return response.status(500).send(error.message);
    }
  }

  async create({ request, response }) {
    try {
      let inputImage = request.file("image");
      let random = RandomString.generate({
        capitalization: "lowercase",
      });

      let fileName = `${voca.snakeCase(
        inputImage.clientName.split(".").slice(0, -1).join(".")
      )}_${random}.${inputImage.extname}`;

      await inputImage.move(Helpers.resourcesPath("uploads/orders"), {
        name: fileName,
      });

      if (!inputImage.moved()) {
        return response.status(422).send(inputImage.errors());
      }

      let create = await OrderFile.create({
        order_stuff_id: request.input("order_stuff_id"),
        page: request.input("page"),
        name: fileName,
        mime: inputImage.extname,
        path: Helpers.resourcesPath("uploads/orders"),
        url: `/api/v1/file/${inputImage.extname}/${fileName}`,
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

      let inputImage = request.file("image", {
        size: "5mb",
        extnames: ["png", "jpg", "jpeg"],
      });

      if (inputImage) {
        let findImage = await OrderFile.query()
          .where("id", request.input("id"))
          .first();

        // Delete image and data if exists
        if (findImage) {
          removeFile(
            path.join(Helpers.resourcesPath("uploads/orders"), findImage.name)
          );
        }

        let fileName = `${voca.snakeCase(
          inputImage.clientName.split(".").slice(0, -1).join(".")
        )}_${random}.${inputImage.extname}`;

        await inputImage.move(Helpers.resourcesPath("uploads/orders"), {
          name: fileName,
        });

        if (!inputImage.moved()) {
          return response.status(422).send(inputImage.errors());
        }

        await OrderFile.query()
          .where("id", request.input("id"))
          .update({
            page: request.input("page"),
            name: fileName,
            mime: inputImage.extname,
            url: `/api/v1/file/${inputImage.extname}/${fileName}`,
          });
      }

      if (!inputImage) {
        await OrderFile.query()
          .where("id", request.input("id"))
          .update({
            page: request.input("page"),
          });
      }

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
      let findImage = await OrderFile.query()
        .where("id", request.input("id"))
        .first();

      // Delete image and data if exists
      if (findImage) {
        removeFile(
          path.join(Helpers.resourcesPath("uploads/orders"), findImage.name)
        );
      }

      await OrderFile.query().where("id", findImage.id).delete();

      return response.send();
    } catch (error) {
      console.log(error.message);
      return response.status(500).send(error.message);
    }
  }
}

module.exports = OrderFileController;
