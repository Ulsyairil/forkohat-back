"use strict";

const Helpers = use("Helpers");
const fs = use("fs");
const path = use("path");
const removeFile = Helpers.promisify(fs.unlink);
const Carousel = use("App/Models/Carousel");
const voca = require("voca");
const RandomString = require("randomstring");
const { validate } = use("Validator");

class CarouselController {
  async index({ request, response }) {
    try {
      const rules = {
        page: "required|integer",
        limit: "required|integer",
        order: "required|in:asc,desc",
        search: "string",
      };

      const validation = await validate(request.all(), rules);

      if (validation.fails()) {
        return response.status(422).send(validation.messages()[0]);
      }

      const page = request.input("page");
      const limit = request.input("limit");
      const order = request.input("order");
      const search = request.input("search");

      let query = Carousel.query();

      if (search) {
        query
          .where("title", "like", `%${search}%`)
          .orWhere("description", "like", `%${search}%`);
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
      const rules = {
        title: "string|max:254",
        description: "string",
        showed: "required|boolean",
      };

      const validation = await validate(request.all(), rules);

      if (validation.fails()) {
        return response.status(422).send(validation.messages()[0]);
      }

      const title = request.input("title");
      const description = request.input("description");
      const showed = request.input("showed") == ("false" || 0) ? false : true;
      const image = request.file("image", {
        extnames: ["png", "jpg", "jpeg"],
      });

      if (image == null) {
        return response.status(422).send({
          message: "Gambar Harus Diunggah",
        });
      }

      let random = RandomString.generate({
        capitalization: "lowercase",
      });

      let fileName = `${voca.snakeCase(
        image.clientName.split(".").slice(0, -1).join(".")
      )}_${random}.${image.extname}`;

      await image.move(Helpers.resourcesPath("uploads/carousel"), {
        name: fileName,
      });

      if (!image.moved()) {
        return response.status(422).send(image.errors());
      }

      let create = await Carousel.create({
        title: title,
        description: description,
        image_name: fileName,
        image_mime: image.extname,
        image_path: Helpers.resourcesPath("uploads/carousel"),
        image_url: `/api/v1/file/${image.extname}/${fileName}`,
        showed: showed,
      });

      return response.send(create);
    } catch (error) {
      console.log(error.message);
      return response.status(500).send(error.message);
    }
  }

  async edit({ request, response }) {
    try {
      // Validate request
      const rules = {
        id: "required|integer",
        title: "string|max:254",
        description: "string",
        showed: "required|boolean",
      };

      const validation = await validate(request.all(), rules);

      if (validation.fails()) {
        return response.status(422).send(validation.messages()[0]);
      }

      // All input
      const carousel_id = request.input("id");
      const title = request.input("title");
      const description = request.input("description");
      const showed = request.input("showed") == ("false" || 0) ? false : true;
      const image = request.file("image", {
        extnames: ["png", "jpg", "jpeg"],
      });

      const findData = await Carousel.query().where("id", carousel_id).first();

      if (findData == null) {
        return response.status(404).send({
          message: "Carousel not found",
        });
      }

      const query = Carousel.query();

      if (image) {
        // Delete image
        removeFile(
          path.join(
            Helpers.resourcesPath("uploads/carousel"),
            findData.image_name
          )
        );

        // Move uploaded image
        let random = RandomString.generate({
          capitalization: "lowercase",
        });

        let fileName = `${voca.snakeCase(
          image.clientName.split(".").slice(0, -1).join(".")
        )}_${random}.${image.extname}`;

        await image.move(Helpers.resourcesPath("uploads/carousel"), {
          name: fileName,
        });

        if (!image.moved()) {
          return response.status(422).send(image.error());
        }

        await query.where("id", carousel_id).update({
          title: title,
          description: description,
          image_name: fileName,
          image_mime: image.extname,
          image_path: Helpers.resourcesPath("uploads/carousel"),
          image_url: `/api/v1/file/${image.extname}/${fileName}`,
          showed: showed,
        });
      } else {
        await query.where("id", carousel_id).update({
          title: title,
          description: description,
          showed: showed,
        });
      }

      const updatedData = await Carousel.query()
        .where("id", carousel_id)
        .first();

      return response.status(200).send(updatedData);
    } catch (error) {
      console.log(error.message);
      return response.status(500).send(error.message);
    }
  }

  async destroy({ request, response }) {
    try {
      const rules = {
        id: "required|integer",
      };

      const validation = await validate(request.all(), rules);

      if (validation.fails()) {
        return response.status(422).send(validation.messages());
      }

      const findFile = await Carousel.query()
        .where("id", request.input("id"))
        .first();

      if (findFile == null) {
        return response.status(400).send({
          message: "Carousel not found",
        });
      }

      // Delete file and data if exists
      if (findFile) {
        removeFile(
          path.join(
            Helpers.resourcesPath("uploads/carousel"),
            findFile.image_name
          )
        );
      }

      await Carousel.query().where("id", findFile.id).delete();

      return response.send({
        message: "Carousel deleted",
      });
    } catch (error) {
      console.log(error.message);
      return response.status(500).send(error.message);
    }
  }
}

module.exports = CarouselController;
