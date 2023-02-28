"use strict";

const Helpers = use("Helpers");
const fs = use("fs");
const path = use("path");
const removeFile = Helpers.promisify(fs.unlink);
const Event = use("App/Models/Event");
const EventFile = use("App/Models/EventFile");
const Arrangement = use("App/Models/Arrangement");
const RandomString = require("randomstring");
const Moment = require("moment");
const voca = require("voca");
const { validate } = use("Validator");

class EventController {
  async index({ request, response }) {
    try {
      const rules = {
        arrangement_id: "required|integer",
        page: "required|integer",
        limit: "required|integer",
        order: "required|in:asc,desc",
        search: "string",
        showed: "required|in:member,public",
        trash: "required|boolean",
      };

      const validation = await validate(request.all(), rules);

      if (validation.fails()) {
        return response.status(422).send(validation.messages()[0]);
      }

      const page = request.input("page");
      const limit = request.input("limit");
      const order = request.input("order");
      const search = request.input("search");
      const arrangement_id = request.input("arrangement_id");
      const showed = request.input("showed");
      const trash = request.input("trash");

      // Find arrangement
      let findArrangement = await Arrangement.find(arrangement_id);

      // Check arrangement if exist
      if (!findArrangement) {
        return response.status(404).send({
          message: "Arrangement not found",
        });
      }

      // Get data
      let query = Event.query()
        .with("Author")
        .with("Arrangement")
        .with("Arrangement.Program")
        .where("arrangement_id", arrangement_id);

      if (search) {
        query
          .where("title", "like", `%${search}%`)
          .orWhere("description", "like", `%${search}%`);
      }

      if (trash == "0" || trash == false) {
        query.whereNull("deleted_at");
      }

      if (trash == "1" || trash == true) {
        query.whereNotNull("deleted_at");
      }

      let data = await query
        .where("showed", showed)
        .orderBy("id", order)
        .paginate(page, limit);

      return response.send(data);
    } catch (error) {
      console.log(error.message);
      return response.status(500).send(error.message);
    }
  }

  async get({ request, response }) {
    try {
      const rules = {
        id: "required|integer",
      };

      const validation = await validate(request.all(), rules);

      if (validation.fails()) {
        return response.status(422).send(validation.messages()[0]);
      }

      const event_id = request.input("id");

      // Get data
      let data = await Event.query()
        .with("Author")
        .with("Arrangement")
        .with("Arrangement.Program")
        .where("id", event_id)
        .first();

      if (!data) {
        return response.status(400).send({
          message: "Event not found",
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
      const rules = {
        arrangement_id: "required|integer",
        title: "required|string",
        description: "required|string",
        registration_date: "date",
        end_registration_date: "required_if:registration_date,date",
        expired_date: "required|date",
        registration_url: "url",
        showed: "required|in:member,public",
      };

      const validation = await validate(request.all(), rules);

      if (validation.fails()) {
        return response.status(422).send(validation.messages()[0]);
      }

      const arrangement_id = request.input("arrangement_id");
      const title = request.input("title");
      const description = request.input("description");
      const registration_date = request.input("registration_date");
      const end_registration_date = request.input("end_registration_date");
      const expired_date = request.input("expired_date");
      const registration_url = request.input("registration_url");
      const showed = request.input("showed");
      const files = request.file("files");
      const image = request.file("image", {
        extnames: ["png", "jpg", "jpeg"],
      });

      // Check if input image is null
      if (image == null) {
        return response.status(422).send({
          message: "Image must be uploaded",
        });
      }

      // Find arrangement
      let findArrangement = await Arrangement.find(arrangement_id);

      // Check arrangement if exist
      if (!findArrangement) {
        return response.status(404).send({
          message: "Arrangement not found",
        });
      }

      // Get user logged in
      const user = await auth.getUser();

      let random = RandomString.generate({
        capitalization: "lowercase",
      });

      // Move image
      let fileName = `${voca.snakeCase(
        image.clientName.split(".").slice(0, -1).join(".")
      )}_${random}.${image.extname}`;

      await image.move(Helpers.resourcesPath("uploads/event"), {
        name: fileName,
      });

      if (!image.moved()) {
        return response.status(422).send(image.errors());
      }

      // Move files
      let movedFiles;
      if (files) {
        await files.moveAll(Helpers.resourcesPath("uploads/event"), (file) => {
          let filename = `${voca.snakeCase(
            file.clientName.split(".").slice(0, -1).join(".")
          )}_${random}.${file.extname}`;

          return {
            name: filename,
          };
        });

        movedFiles = files.movedList();

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
      }

      // Create data
      let event = await Event.create({
        author_id: user.id,
        arrangement_id: arrangement_id,
        title: title,
        description: description,
        registration_date: registration_date,
        end_registration_date: end_registration_date,
        expired_date: expired_date,
        registration_url: registration_url,
        image_name: fileName,
        image_mime: image.extname,
        image_path: Helpers.resourcesPath("uploads/event"),
        image_url: `/api/v1/file/${image.extname}/${fileName}`,
        showed: showed,
      });

      if (files) {
        movedFiles.forEach(async (value) => {
          await EventFile.create({
            event_id: event.id,
            name: value.fileName,
            mime: value.extname,
            path: Helpers.resourcesPath("uploads/event"),
            url: `/api/v1/file/${value.extname}/${value.fileName}`,
          });
        });
      }

      // Get data created
      let data = await Event.query()
        .with("Author")
        .with("EventFiles")
        .with("Arrangement")
        .with("Arrangement.Program")
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
      const rules = {
        id: "required|integer",
        arrangement_id: "required|integer",
        title: "required|string",
        description: "required|string",
        registration_date: "date",
        end_registration_date: "date",
        expired_date: "required|date",
        registration_url: "url",
        showed: "required|in:member,public",
      };

      const validation = await validate(request.all(), rules);

      if (validation.fails()) {
        return response.status(422).send(validation.messages()[0]);
      }

      const event_id = request.input("id");
      const arrangement_id = request.input("arrangement_id");
      const title = request.input("title");
      const description = request.input("description");
      const registration_date = request.input("registration_date");
      const end_registration_date = request.input("end_registration_date");
      const expired_date = request.input("expired_date");
      const registration_url = request.input("registration_url");
      const showed = request.input("showed");
      const image = request.file("image", {
        extnames: ["png", "jpg", "jpeg"],
      });

      let random = RandomString.generate({
        capitalization: "lowercase",
      });

      // Upload image
      let fileName;
      if (image) {
        let findImage = await Event.query().where("id", event_id).first();

        fileName = `${voca.snakeCase(
          image.clientName.split(".").slice(0, -1).join(".")
        )}_${random}.${image.extname}`;

        await image.move(Helpers.resourcesPath("uploads/event"), {
          name: fileName,
        });

        if (!image.moved()) {
          return response.status(422).send(image.errors());
        }

        removeFile(
          path.join(
            Helpers.resourcesPath("uploads/event"),
            findImage.image_name
          )
        );
      }

      let updateEvent = Event.query().where("id", request.input("event_id"));

      // Update event table
      if (image) {
        await updateEvent.update({
          arrangement_id: arrangement_id,
          title: title,
          description: description,
          registration_date: registration_date,
          end_registration_date: end_registration_date,
          expired_date: expired_date,
          registration_url: registration_url,
          image_name: fileName,
          image_mime: image.extname,
          image_path: Helpers.resourcesPath("uploads/event"),
          image_url: `/api/v1/file/${image.extname}/${fileName}`,
          showed: showed,
        });
      } else {
        await updateEvent.update({
          arrangement_id: arrangement_id,
          title: title,
          description: description,
          registration_date: registration_date,
          end_registration_date: end_registration_date,
          expired_date: expired_date,
          registration_url: registration_url,
          showed: showed,
        });
      }

      // Get data created
      let data = await Event.query()
        .with("Author")
        .with("EventFiles")
        .with("Arrangement")
        .with("Arrangement.Program")
        .where("id", event_id)
        .first();

      return response.send(data);
    } catch (error) {
      console.log(error.message);
      return response.status(500).send(error.message);
    }
  }

  async dump({ request, response }) {
    try {
      // Validate request
      const rules = {
        id: "required|integer",
      };

      const validation = await validate(request.all(), rules);

      if (validation.fails()) {
        return response.status(422).send(validation.messages()[0]);
      }

      // All input
      const event_id = request.input("id");

      // Check event if exist
      const findData = await Event.find(event_id);

      if (!findData) {
        return response.status(404).send({
          message: "Event not found",
        });
      }

      // Dump data
      await Event.query().where("id", event_id).update({
        deleted_at: Moment.now(),
      });

      // Get data dumped
      let data = await Event.query().where("id", event_id).first();

      return response.send(data);
    } catch (error) {
      console.log(error.message);
      return response.status(500).send(error.message);
    }
  }

  async restore({ request, response }) {
    try {
      // Validate request
      const rules = {
        id: "required|integer",
      };

      const validation = await validate(request.all(), rules);

      if (validation.fails()) {
        return response.status(422).send(validation.messages()[0]);
      }

      // All input
      const event_id = request.input("id");

      // Check event if exist
      const findData = await Event.find(event_id);

      if (!findData) {
        return response.status(404).send({
          message: "Event not found",
        });
      }

      // Restore event
      await Event.query().where("id", event_id).update({
        deleted_at: null,
      });

      // Get data restored
      let data = await Event.query()
        .where("id", request.input("event_id"))
        .first();

      return response.send(data);
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

      const event_id = request.input("id");

      // Check event if exist
      const findData = await Event.find(event_id);

      if (!findData) {
        return response.status(404).send({
          message: "Event not found",
        });
      }

      let findImage = await EventFile.query()
        .where("event_id", event_id)
        .fetch();

      let convert = findImage.toJSON();

      convert.forEach((value) => {
        removeFile(path.join(value.path, value.name));
      });

      removeFile(
        path.join(
          Helpers.resourcesPath("uploads/event"),
          findData.image_name
        )
      );

      await EventFile.query().where("event_id", event_id).delete();
      await Event.query().where("id", event_id).delete();

      return response.send({
        message: "Event deleted",
      });
    } catch (error) {
      console.log(error.message);
      return response.status(500).send(error.message);
    }
  }
}

module.exports = EventController;
