"use strict";

const Helpers = use("Helpers");
const fs = use("fs");
const path = use("path");
const removeFile = Helpers.promisify(fs.unlink);
const Event = use("App/Models/Event");
const EventFile = use("App/Models/EventFile");
const RandomString = use("randomstring");
const Moment = use("moment");
const { validateAll } = use("Validator");

class EventController {
  async index({ request, response }) {
    try {
      let queryTotalData = await Event.query()
        .with("users")
        .count("* as total");

      let totalData = queryTotalData[0].total;
      console.log(totalData);

      let queryTotalFilteredData = Event.query();

      if (request.input("search").value != "") {
        queryTotalFilteredData
          .with("users", (builder) => {
            builder.where("name", "like", `%${request.input("search").value}%`);
          })
          .where("name", "like", `%${request.input("search").value}%`)
          .orWhere("content", "like", `%${request.input("search").value}%`)
          .orWhere(
            "registration_date",
            "like",
            `%${request.input("search").value}%`
          )
          .orWhere("expired_date", "like", `%${request.input("search").value}%`)
          .orWhere("created_at", "like", `%${request.input("search").value}%`)
          .orWhere("updated_at", "like", `%${request.input("search").value}%`)
          .orWhere("deleted_at", "like", `%${request.input("search").value}%`);
      }

      let count = await queryTotalFilteredData.count("* as total");
      let totalFiltered = count[0].total;

      let getData = Event.query().with("users");

      if (request.input("search").value != "") {
        getData
          .with("users", (builder) => {
            builder.where("name", "like", `%${request.input("search").value}%`);
          })
          .where("name", "like", `%${request.input("search").value}%`)
          .orWhere("content", "like", `%${request.input("search").value}%`)
          .orWhere(
            "registration_date",
            "like",
            `%${request.input("search").value}%`
          )
          .orWhere("expired_date", "like", `%${request.input("search").value}%`)
          .orWhere("created_at", "like", `%${request.input("search").value}%`)
          .orWhere("updated_at", "like", `%${request.input("search").value}%`)
          .orWhere("deleted_at", "like", `%${request.input("search").value}%`);
      }

      request.input("order").forEach((value) => {
        getData.orderBy(value.column, value.dir);
      });

      getData.offset(request.input("start")).limit(request.input("length"));

      let data = await getData.fetch();
      console.log(data);

      return response.send({
        draw: Number(request.input("draw")),
        recordsTotal: totalData,
        recordsFiltered: totalFiltered,
        data: data,
      });
    } catch (error) {
      console.log(error);
      return response.status(500).send(error);
    }
  }

  async get({ request, response }) {
    try {
      let data = await Event.query()
        .with("users")
        .with("eventFile")
        .where("id", request.input("event_id"))
        .first();

      if (!data) {
        return response.status(404).send({
          message: "not found",
        });
      }

      return response.send(data);
    } catch (error) {
      console.log(error);
      return response.status(500).send(error);
    }
  }

  async create({ auth, request, response }) {
    try {
      let user = await auth.getUser();

      // Insert to events table
      let event = await Event.create({
        author_id: user.id,
        name: request.input("name"),
        content: request.input("content"),
        registration_date: request.input("registration_date"),
        expired_date: request.input("expired_date"),
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
            return {
              name: `${RandomString.generate()}.${file.subtype}`,
            };
          }
        );

        const movedFiles = inputFiles.movedList();

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

        movedFiles.forEach(async (value) => {
          await EventFile.create({
            event_id: event.id,
            type: "files",
            name: value.fileName,
            mime: value.subtype,
            path: Helpers.resourcesPath("uploads/events"),
            url: "/",
          });
        });
      }

      // Upload image
      let inputImage = request.file("image");

      if (inputImage) {
        let fileName = `${RandomString.generate()}.${inputImage.subtype}`;

        await inputImage.move(Helpers.resourcesPath("uploads/events"), {
          name: fileName,
        });

        if (!inputImage.moved()) {
          return response.status(422).send(inputImage.errors());
        }

        await EventFile.create({
          event_id: event.id,
          type: "banner",
          name: fileName,
          mime: inputImage.subtype,
          path: Helpers.resourcesPath("uploads/events"),
          url: "/",
        });
      }

      // Get data created
      let data = await Event.query()
        .with("users")
        .with("eventFile")
        .where("id", event.id)
        .fetch();

      return response.send(data);
    } catch (error) {
      console.log(error);
      return response.status(500).send(error);
    }
  }

  async edit({ request, response }) {
    try {
      // Insert to events table
      await Event.query()
        .where("id", request.input("event_id"))
        .update({
          name: request.input("name"),
          content: request.input("content"),
          registration_date: request.input("registration_date"),
          expired_date: request.input("expired_date"),
        });

      // Upload multi file
      let inputFiles = request.file("files", {
        size: "2mb",
      });

      if (inputFiles) {
        await inputFiles.moveAll(
          Helpers.resourcesPath("uploads/events"),
          (file) => {
            return {
              name: `${RandomString.generate()}.${file.subtype}`,
            };
          }
        );

        const movedFiles = inputFiles.movedList();

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

        movedFiles.forEach(async (value) => {
          await EventFile.create({
            event_id: request.input("event_id"),
            type: "files",
            name: value.fileName,
            mime: value.subtype,
            path: Helpers.resourcesPath("uploads/events"),
            url: "/",
          });
        });
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

        let fileName = `${RandomString.generate()}.${inputImage.subtype}`;

        await inputImage.move(Helpers.resourcesPath("uploads/events"), {
          name: fileName,
        });

        if (!inputImage.moved()) {
          return response.status(422).send(inputImage.errors());
        }

        await EventFile.create({
          event_id: request.input("event_id"),
          type: "banner",
          name: fileName,
          mime: inputImage.subtype,
          path: Helpers.resourcesPath("uploads/events"),
          url: "/",
        });
      }

      // Get data created
      let data = await Event.query()
        .with("users")
        .with("eventFile")
        .where("id", request.input("event_id"))
        .fetch();

      return response.send(data);
    } catch (error) {
      console.log(error);
      return response.status(500).send(error);
    }
  }

  async dump({ request, response }) {
    try {
      const rules = {
        event_id: "required|number",
      };

      const validation = await validateAll(request.all(), rules);

      if (validation.fails()) {
        return response.status(422).send(validation.messages());
      }

      await Event.query().where("id", request.input("event_id")).update({
        deleted_at: Moment.now(),
      });

      // Get data created
      let data = await Event.query()
        .with("users")
        .with("eventFile")
        .where("id", request.input("event_id"))
        .fetch();

      return response.send(data);
    } catch (error) {
      console.log(error);
      return response.status(500).send(error);
    }
  }

  async restore({ request, response }) {
    try {
      const rules = {
        event_id: "required|number",
      };

      const validation = await validateAll(request.all(), rules);

      if (validation.fails()) {
        return response.status(422).send(validation.messages());
      }

      await Event.query().where("id", request.input("event_id")).update({
        deleted_at: null,
      });

      // Get data created
      let data = await Event.query()
        .with("users")
        .with("eventFile")
        .where("id", request.input("event_id"))
        .fetch();

      return response.send(data);
    } catch (error) {
      console.log(error);
      return response.status(500).send(error);
    }
  }

  async delete({ request, response }) {
    try {
      const rules = {
        event_id: "required|number",
      };

      const validation = await validateAll(request.all(), rules);

      if (validation.fails()) {
        return response.status(422).send(validation.messages());
      }

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
      console.log(error);
      return response.status(500).send(error);
    }
  }

  async deleteFile({ request, response }) {
    try {
      const rules = {
        file_id: "required|number",
      };

      const validation = await validateAll(request.all(), rules);

      if (validation.fails()) {
        return response.status(422).send(validation.messages());
      }

      let findFile = await EventFile.query()
        .where("id", request.input("file_id"))
        .first();

      if (!findFile) {
        return response.status(404).send({
          message: "file not found",
        });
      }

      removeFile(path.join(findFile.path, findFile.name));

      await EventFile.query().where("id", request.input("file_id")).delete();

      return response.send({
        message: "file deleted",
      });
    } catch (error) {
      console.log(error);
      return response.status(500).send(error);
    }
  }
}

module.exports = EventController;
