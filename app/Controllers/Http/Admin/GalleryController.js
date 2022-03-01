"use strict";

const Helpers = use("Helpers");
const fs = use("fs");
const path = use("path");
const removeFile = Helpers.promisify(fs.unlink);
const Gallery = use("App/Models/Gallery");
const voca = require("voca");
const RandomString = require("randomstring");
const { validate } = use("Validator");

class GalleryController {
  async index({ request, response }) {
    try {
      // Validate request
      const rules = {
        page: "required|integer",
        limit: "required|integer",
        order: "required|in:asc,desc",
        search: "string",
        showed: "required|in:private,member,public",
      };

      const validation = await validate(request.all(), rules);

      if (validation.fails()) {
        return response.status(422).send(validation.messages()[0]);
      }

      // All input
      const page = request.input("page");
      const limit = request.input("limit");
      const order = request.input("order");
      const search = request.input("search");
      const showed = request.input("showed");

      let query = Gallery.query();

      if (search) {
        query.where("title", "like", `%${search}%`);
      }

      const data = await query
        .where("showed", showed)
        .orderBy("id", order)
        .paginate(page, limit);

      return response.status(200).send(data);
    } catch (error) {
      console.log(error.message);
      return response.status(500).send(error.message);
    }
  }

  async create({ auth, request, response }) {
    try {
      // Validate request
      const rules = {
        title: "string",
        showed: "required|in:private,member,public",
      };

      const validation = await validate(request.all(), rules);

      if (validation.fails()) {
        return response.status(422).send(validation.messages()[0]);
      }

      // All input
      const title = request.input("title");
      const showed = request.input("showed");
      const image = request.file("image");

      // Get user data logged in
      const user = await auth.getUser();

      // Check if input image is null / empty
      if (image == null) {
        return response.status(422).send({
          message: "Gambar Harus Diunggah",
        });
      }

      // Move uploaded image
      let random = RandomString.generate({
        capitalization: "lowercase",
      });

      let fileName = `${voca.snakeCase(
        image.clientName.split(".").slice(0, -1).join(".")
      )}_${random}.${image.extname}`;

      await image.move(Helpers.resourcesPath("uploads/gallery"), {
        name: fileName,
      });

      if (!image.moved()) {
        return response.status(422).send(image.error());
      }

      // Create data
      let create = await Gallery.create({
        title: title,
        uploaded_by: user.id,
        updated_by: user.id,
        image_name: fileName,
        image_mime: image.extname,
        image_path: Helpers.resourcesPath("uploads/gallery"),
        image_url: `/api/v1/file/${image.extname}/${fileName}`,
        showed: showed,
      });

      return response.send(create);
    } catch (error) {
      console.log(error.message);
      return response.status(500).send(error.message);
    }
  }

  async edit({ auth, request, response }) {
    try {
      // Validate request
      const rules = {
        gallery_id: "required|integer",
        title: "string",
        showed: "required|in:private,member,public",
      };

      const validation = await validate(request.all(), rules);

      if (validation.fails()) {
        return response.status(422).send(validation.messages()[0]);
      }

      // All input
      const gallery_id = request.input("gallery_id");
      const title = request.input("title");
      const showed = request.input("showed");
      const image = request.file("image");

      // Get user data logged in
      const user = await auth.getUser();

      let findData = await Gallery.query().where("id", gallery_id).first();

      if (findData == null) {
        return response.status(404).send({
          message: "Galeri Tidak Ditemukan",
        });
      }

      const query = Gallery.query();

      if (image) {
        // Delete image
        removeFile(
          path.join(
            Helpers.resourcesPath("uploads/gallery"),
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

        await image.move(Helpers.resourcesPath("uploads/gallery"), {
          name: fileName,
        });

        if (!image.moved()) {
          return response.status(422).send(image.error());
        }

        await query.where("id", gallery_id).update({
          title: title,
          updated_by: user.id,
          image_name: fileName,
          image_mime: image.extname,
          image_path: Helpers.resourcesPath("uploads/gallery"),
          image_url: `/api/v1/file/${image.extname}/${fileName}`,
          showed: showed,
        });
      } else {
        await query.where("id", gallery_id).update({
          title: title,
          updated_by: user.id,
          showed: showed,
        });
      }

      let updatedData = await Gallery.query().where("id", gallery_id).first();

      return response.status(200).send(updatedData);
    } catch (error) {
      console.log(error.message);
      return response.status(500).send(error.message);
    }
  }

  async destroy({ request, response }) {
    try {
      // Validate request
      const rules = {
        gallery_id: "required|integer",
      };

      const validation = await validate(request.all(), rules);

      if (validation.fails()) {
        return response.status(422).send(validation.messages()[0]);
      }

      // All input
      const gallery_id = request.input("gallery_id");

      const findData = await Gallery.query().where("id", gallery_id).first();

      if (findData == null) {
        return response.status(404).send({
          message: "Galeri Tidak Ditemukan",
        });
      }

      // Delete image
      removeFile(
        path.join(Helpers.resourcesPath("uploads/gallery"), findData.image_name)
      );

      // Delete data
      await Gallery.query().where("id", gallery_id).delete();

      return response.send({
        message: "Gambar Berhasil Dihapus",
      });
    } catch (error) {
      console.log(error.message);
      return response.status(500).send(error.message);
    }
  }
}

module.exports = GalleryController;
