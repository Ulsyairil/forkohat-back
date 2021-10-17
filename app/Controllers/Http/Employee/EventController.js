"use strict";

const Helpers = use("Helpers");
const fs = use("fs");
const path = use("path");
const removeFile = Helpers.promisify(fs.unlink);
const Event = use("App/Models/Event");
const EventFile = use("App/Models/EventFile");
const RandomString = require("randomstring");
const Moment = require("moment");
const voca = require("voca");

class EventController {
  async index({ request, response }) {
    try {
      let data = await Event.query()
        .where("order_id", request.input("order_id"))
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
      let data = await Event.query()
        .with("users")
        .with("eventFiles")
        .where("id", request.input("event_id"))
        .first();

      if (!data) {
        return response.status(400).send({
          message: "not found",
        });
      }

      return response.send(data);
    } catch (error) {
      console.log(error.message);
      return response.status(500).send(error.message);
    }
  }

  async create({ auth, request, response }) {
    try {
      let fileName, movedFiles;
      let user = await auth.getUser();
      let random = RandomString.generate({
        capitalization: "lowercase",
      });

      // Upload multi file
      const validationFile = {
        size: "2mb",
      };
      let inputFiles = request.file("files", validationFile);

      if (inputFiles) {
        await inputFiles.moveAll(
          Helpers.resourcesPath("uploads/events"),
          (file) => {
            let filename = `${voca.snakeCase(
              file.clientName.split(".").slice(0, -1).join(".")
            )}_${random}.${file.extname}`;

            return {
              name: filename,
            };
          }
        );

        movedFiles = inputFiles.movedList();

        if (!inputFiles.movedAll()) {
          await Promise.all(
            movedFiles.map((file) => {
              return removeFile(
                path.join(
                  Helpers.resourcesPath("uploads/events"),
                  file.fileName
                )
              );
            })
          );

          return response.status(422).send(inputFiles.errors());
        }
      }

      // Upload image
      let inputImage = request.file("image");

      if (inputImage) {
        fileName = `${voca.snakeCase(
          inputImage.clientName.split(".").slice(0, -1).join(".")
        )}_${random}.${inputImage.extname}`;

        await inputImage.move(Helpers.resourcesPath("uploads/events"), {
          name: fileName,
        });

        if (!inputImage.moved()) {
          return response.status(422).send(inputImage.errors());
        }
      }

      // Insert to events table
      let event = await Event.create({
        author_id: user.id,
        order_id: request.input("order_id"),
        name: request.input("name"),
        content: request.input("content"),
        registration_date: request.input("registration_date"),
        expired_date: request.input("expired_date"),
        url: request.input("url"),
        showed: request.input("showed"),
      });

      if (inputFiles) {
        movedFiles.forEach(async (value) => {
          await EventFile.create({
            event_id: event.id,
            type: "files",
            name: value.fileName,
            mime: value.extname,
            path: Helpers.resourcesPath("uploads/events"),
            url: `/api/v1/file/${value.extname}/${value.fileName}`,
          });
        });
      }

      if (inputImage) {
        await EventFile.create({
          event_id: event.id,
          type: "banner",
          name: fileName,
          mime: inputImage.extname,
          path: Helpers.resourcesPath("uploads/events"),
          url: `/api/v1/file/${inputImage.extname}/${fileName}`,
        });
      }

      // Get data created
      let data = await Event.query()
        .with("users")
        .with("eventFiles")
        .where("id", event.id)
        .first();

      return response.send(data);
    } catch (error) {
      console.log(error.message);
      return response.status(500).send(error.message);
    }
  }

  async edit({ request, response }) {
    try {
      let movedFiles, fileName;
      let random = RandomString.generate({
        capitalization: "lowercase",
      });

      // Upload multi file
      let inputFiles = request.file("files", {
        size: "2mb",
      });

      if (inputFiles) {
        await inputFiles.moveAll(
          Helpers.resourcesPath("uploads/events"),
          (file) => {
            let filename = `${voca.snakeCase(
              file.clientName.split(".").slice(0, -1).join(".")
            )}_${random}.${file.extname}`;

            return {
              name: filename,
            };
          }
        );

        movedFiles = inputFiles.movedList();

        if (!inputFiles.movedAll()) {
          await Promise.all(
            movedFiles.map((file) => {
              return removeFile(
                path.join(
                  Helpers.resourcesPath("uploads/events"),
                  file.fileName
                )
              );
            })
          );

          return response.status(422).send(inputFiles.errors());
        }
      }

      // Upload image
      let inputImage = request.file("image", {
        size: "5mb",
        extnames: ["png", "jpg", "jpeg"],
      });

      if (inputImage) {
        let findImage = await EventFile.query()
          .where("event_id", request.input("event_id"))
          .andWhere("type", "banner")
          .first();

        // Delete image and data if exists
        if (findImage) {
          removeFile(
            path.join(Helpers.resourcesPath("uploads/events"), findImage.name)
          );

          await EventFile.query().where("id", findImage.id).delete();
        }

        fileName = `${voca.snakeCase(
          inputImage.clientName.split(".").slice(0, -1).join(".")
        )}_${random}.${inputImage.extname}`;

        await inputImage.move(Helpers.resourcesPath("uploads/events"), {
          name: fileName,
        });

        if (!inputImage.moved()) {
          return response.status(422).send(inputImage.errors());
        }
      }

      // Update events table
      await Event.query()
        .where("id", request.input("event_id"))
        .update({
          name: request.input("name"),
          content: request.input("content"),
          registration_date: request.input("registration_date"),
          expired_date: request.input("expired_date"),
          url: request.input("url"),
          showed: request.input("showed"),
        });

      if (inputFiles) {
        movedFiles.forEach(async (value) => {
          await EventFile.create({
            event_id: request.input("event_id"),
            type: "files",
            name: value.fileName,
            mime: value.extname,
            path: Helpers.resourcesPath("uploads/events"),
            url: `/api/v1/file/${value.extname}/${value.fileName}`,
          });
        });
      }

      if (inputImage) {
        await EventFile.create({
          event_id: request.input("event_id"),
          type: "banner",
          name: fileName,
          mime: inputImage.extname,
          path: Helpers.resourcesPath("uploads/events"),
          url: `/api/v1/file/${inputImage.extname}/${fileName}`,
        });
      }

      // Get data created
      let data = await Event.query()
        .with("users")
        .with("eventFiles")
        .where("id", request.input("event_id"))
        .first();

      return response.send(data);
    } catch (error) {
      console.log(error.message);
      return response.status(500).send(error.message);
    }
  }

  async dump({ request, response }) {
    try {
      await Event.query().where("id", request.input("event_id")).update({
        deleted_at: Moment.now(),
      });

      // Get data created
      let data = await Event.query()
        .with("users")
        .with("eventFiles")
        .where("id", request.input("event_id"))
        .first();

      return response.send(data);
    } catch (error) {
      console.log(error.message);
      return response.status(500).send(error.message);
    }
  }

  async restore({ request, response }) {
    try {
      await Event.query().where("id", request.input("event_id")).update({
        deleted_at: null,
      });

      // Get data created
      let data = await Event.query()
        .with("users")
        .with("eventFiles")
        .where("id", request.input("event_id"))
        .first();

      return response.send(data);
    } catch (error) {
      console.log(error.message);
      return response.status(500).send(error.message);
    }
  }

  async delete({ request, response }) {
    try {
      let findImage = await EventFile.query()
        .where("event_id", request.input("event_id"))
        .fetch();

      let convert = findImage.toJSON();

      convert.forEach((value) => {
        removeFile(path.join(value.path, value.name));
      });

      await EventFile.query()
        .where("event_id", request.input("event_id"))
        .delete();
      await Event.query().where("id", request.input("event_id")).delete();

      return response.send({
        message: "deleted",
      });
    } catch (error) {
      console.log(error.message);
      return response.status(500).send(error.message);
    }
  }

  async deleteFile({ request, response }) {
    try {
      let findFile = await EventFile.query()
        .where("id", request.input("file_id"))
        .first();

      if (!findFile) {
        return response.status(400).send({
          message: "file not found",
        });
      }

      removeFile(path.join(findFile.path, findFile.name));

      await EventFile.query().where("id", request.input("file_id")).delete();

      return response.send({
        message: "file deleted",
      });
    } catch (error) {
      console.log(error.message);
      return response.status(500).send(error.message);
    }
  }
}

module.exports = EventController;
