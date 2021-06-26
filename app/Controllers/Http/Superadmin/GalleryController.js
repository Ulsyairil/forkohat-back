"use strict";

const Helpers = use("Helpers");
const fs = use("fs");
const path = use("path");
const removeFile = Helpers.promisify(fs.unlink);
const Gallery = use("App/Models/Gallery");
const Moment = require("moment");
const voca = require("voca");
const RandomString = require("randomstring");

class GalleryController {
  async index({ request, response }) {
    try {
      const page = request.input("page");
      const limit = request.input("limit");
      const order = request.input("order");
      const search = request.input("search");

      let query = Gallery.query();

      if (search) {
        query
          .where("picture_name", "like", `%${search}%`)
          .orWhere("picture_description", "like", `%${search}%`);
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

      await inputFile.move(Helpers.resourcesPath("uploads/gallery"), {
        name: fileName,
      });

      if (!inputFile.moved()) {
        return response.status(422).send(inputFile.errors());
      }

      let create = await Gallery.create({
        picture_name: request.input("picture_name"),
        picture_description: request.input("picture_description"),
        name: fileName,
        mime: inputFile.extname,
        path: Helpers.resourcesPath("uploads/gallery"),
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
      let findFile = await Gallery.query()
        .where("id", request.input("gallery_id"))
        .first();

      if (findFile == null) {
        return response.status(400).send({
          message: "Gambar tidak ditemukan",
        });
      }

      // Delete file and data if exists
      if (findFile) {
        removeFile(
          path.join(Helpers.resourcesPath("uploads/gallery"), findFile.name)
        );
      }

      await Gallery.query().where("id", findFile.id).delete();

      return response.send({
        message: "deleted",
      });
    } catch (error) {
      console.log(error.message);
      return response.status(500).send(error.message);
    }
  }
}

module.exports = GalleryController;
