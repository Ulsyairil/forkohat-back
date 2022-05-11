"use strict";

const Helpers = use("Helpers");
const fs = use("fs");
const path = use("path");
const removeFile = Helpers.promisify(fs.unlink);
const Event = use("App/Models/Event");
const EventFile = use("App/Models/EventFile");
const RandomString = require("randomstring");
const voca = require("voca");
const { validate } = use("Validator");

class EventFileController {
  async index({ request, response }) {
    try {
      const rules = {
        event_id: "required|integer",
        page: "required|integer",
        limit: "required|integer",
        order: "required|in:asc,desc",
      };

      const validation = await validate(request.all(), rules);

      if (validation.fails()) {
        return response.status(422).send(validation.messages()[0]);
      }

      const page = request.input("page");
      const limit = request.input("limit");
      const order = request.input("order");
      const event_id = request.input("event_id");

      const findEvent = await Event.find(event_id);

      if (!findEvent) {
        return response.status(404).send({
          message: "Kegiatan Tidak Ditemukan",
        });
      }

      const data = await EventFile.query()
        .where("event_id", event_id)
        .orderBy("id", order)
        .paginate(page, limit);

      return response.send(data);
    } catch (error) {
      console.log(error.message);
      return response.status(500).send(error.message);
    }
  }

  async create({ request, response }) {
    try {
      const rules = {
        event_id: "required|integer",
      };

      const validation = await validate(request.all(), rules);

      if (validation.fails()) {
        return response.status(422).send(validation.messages()[0]);
      }

      const event_id = request.input("event_id");
      const files = request.file("files");

      if (files == null) {
        return response.status(400).send({
          message: "Berkas harus diunggah",
        });
      }

      let random = RandomString.generate({
        capitalization: "lowercase",
      });

      let filename;
      await files.moveAll(Helpers.resourcesPath("uploads/event"), (file) => {
        filename = `${voca.snakeCase(
          file.clientName.split(".").slice(0, -1).join(".")
        )}_${random}.${file.extname}`;

        return {
          name: filename,
        };
      });

      let movedFiles = files.movedList();

      if (!files.movedAll()) {
        await Promise.all(
          movedFiles.map((file) => {
            return removeFile(
              path.join(Helpers.resourcesPath("uploads/event"), file.fileName)
            );
          })
        );

        return response.status(422).send(files.errors());
      }

      movedFiles.forEach(async (value) => {
        await EventFile.create({
          event_id: event_id,
          name: value.fileName,
          mime: value.extname,
          path: Helpers.resourcesPath("uploads/event"),
          url: `/api/v1/file/${value.extname}/${value.fileName}`,
        });
      });
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
        return response.status(422).send(validation.messages()[0]);
      }

      const file_id = request.input("id");

      const findFile = await EventFile.query().where("id", file_id).first();

      if (!findFile) {
        return response.status(404).send({
          message: "Event file not found",
        });
      }

      removeFile(path.join(findFile.path, findFile.name));

      await EventFile.query().where("id", file_id).delete();

      return response.send({
        message: "Event file deleted",
      });
    } catch (error) {
      console.log(error.message);
      return response.status(500).send(error.message);
    }
  }
}

module.exports = EventFileController;
