"use strict";

const Helpers = use("Helpers");
const fs = use("fs");
const path = use("path");
const removeFile = Helpers.promisify(fs.unlink);
const CarouselPicture = use("App/Models/CarouselPicture");
const Moment = require("moment");
const voca = require("voca");
const RandomString = require("randomstring");

class CarouselPictureController {
  async index({ request, response }) {
    try {
      const page = request.input("page");
      const limit = request.input("limit");
      const order = request.input("order");
      const search = request.input("search");

      let query = CarouselPicture.query();

      if (search) {
        query
          .where("carousel_name", "like", `%${search}%`)
          .orWhere("carousel_description", "like", `%${search}%`);
      }

      const data = await query.orderBy("id", order).paginate(page, limit);

      return response.status(200).send(data);
    } catch (error) {
      console.log(error.message);
      return response.status(500).send(error.message);
    }
  }

  async create({ request, response }) {
    try {
      let inputFile = request.file("image");
      let random = RandomString.generate({
        capitalization: "lowercase",
      });

      let fileName = `${voca.snakeCase(
        inputFile.clientName.split(".").slice(0, -1).join(".")
      )}_${random}.${inputFile.extname}`;

      await inputFile.move(Helpers.resourcesPath("uploads/carousel"), {
        name: fileName,
      });

      if (!inputFile.moved()) {
        return response.status(422).send(inputFile.errors());
      }

      let create = await CarouselPicture.create({
        carousel_name: request.input("carousel_name"),
        carousel_description: request.input("carousel_description"),
        name: fileName,
        mime: inputFile.extname,
        path: Helpers.resourcesPath("uploads/carousel"),
        url: `/api/v1/file/${inputFile.extname}/${fileName}`,
      });

      return response.send(create);
    } catch (error) {
      console.log(error.message);
      return response.status(500).send(error.message);
    }
  }

  async delete({ request, response }) {
    try {
      let findFile = await CarouselPicture.query()
        .where("id", request.input("carousel_id"))
        .first();

      if (findFile == null) {
        return response.status(400).send({
          message: "Gambar tidak ditemukan",
        });
      }

      // Delete file and data if exists
      if (findFile) {
        removeFile(
          path.join(Helpers.resourcesPath("uploads/carousel"), findFile.name)
        );
      }

      await CarouselPicture.query().where("id", findFile.id).delete();

      return response.send({
        message: "deleted",
      });
    } catch (error) {
      console.log(error.message);
      return response.status(500).send(error.message);
    }
  }
}

module.exports = CarouselPictureController;
