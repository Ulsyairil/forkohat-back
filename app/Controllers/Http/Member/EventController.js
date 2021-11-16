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
          message: "Tatanan Tidak Ditemukan",
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
        event_id: "required|integer",
      };

      const validation = await validate(request.all(), rules);

      if (validation.fails()) {
        return response.status(422).send(validation.messages()[0]);
      }

      const event_id = request.input("event_id");

      // Get data
      let data = await Event.query()
        .with("Author")
        .with("EventFiles")
        .with("Arrangement")
        .with("Arrangement.Program")
        .where("id", event_id)
        .first();

      if (!data) {
        return response.status(404).send({
          message: "Kegiatan Tidak Ditemukan",
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

      const messages = {
        "arrangement_id.required": "ID Tatanan Harus Diisi",
        "arrangement_id.integer": "ID Tatanan Harus Berupa Angka",
        "title.required": "Judul Kegiatan Harus Diisi",
        "description.required": "Deskripsi Kegiatan Harus Diisi",
        "registration_date.date":
          "Tanggal Registrasi Kegiatan Harus Berupa Tanggal : DD/MM/YYYY",
        "end_registration_date.required_if":
          "Tanggal Berakhir Registrasi Kegiatan Harus Diisi",
        "end_registration_date.date":
          "Tanggal Berakhir Registrasi Kegiatan Harus Berupa Tanggal : DD/MM/YYYY",
        "expired_date.required": "Tanggal Berakhir Kegiatan Harus Diisi",
        "expired_date.date":
          "Tanggal Berakhir Kegiatan Harus Berupa Tanggal : DD/MM/YYYY",
        "registration_url.url": "URL Registrasi Kegiatan Harus Berupa Link",
        "showed.required": "Kegiatan Ditampilkan Harus Diisi",
        "showed.in": "Kegiatan Ditampilkan Harus Diisi : member, atau public",
      };

      const validation = await validate(request.all(), rules, messages);

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
          message: "Gambar Kegiatan Harus Diunggah",
        });
      }

      // Find arrangement
      let findArrangement = await Arrangement.find(arrangement_id);

      // Check arrangement if exist
      if (!findArrangement) {
        return response.status(404).send({
          message: "Tatanan Tidak Ditemukan",
        });
      }

      // Get user logged in
      const user = await auth.getUser();

      let random = RandomString.generate({
        capitalization: "lowercase",
      });

      // Move image
      let fileName;
      fileName = `${voca.snakeCase(
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
        console.log(movedFiles);
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

      // return response.status(200).send("test");
    } catch (error) {
      console.log(error.message);
      return response.status(500).send(error.message);
    }
  }

  async edit({ request, response }) {
    try {
      const rules = {
        event_id: "required|integer",
        arrangement_id: "required|integer",
        title: "required|string",
        description: "required|string",
        registration_date: "date",
        end_registration_date: "date",
        expired_date: "required|date",
        registration_url: "url",
        showed: "required|in:member,public",
      };

      const messages = {
        "event_id.required": "ID Kegiatan Harus Diisi",
        "event_id.integer": "ID Kegiatan Harus Berupa Angka",
        "arrangement_id.required": "ID Tatanan Harus Diisi",
        "arrangement_id.integer": "ID Tatanan Harus Berupa Angka",
        "title.required": "Judul Kegiatan Harus Diisi",
        "description.required": "Deskripsi Kegiatan Harus Diisi",
        "registration_date.date":
          "Tanggal Registrasi Kegiatan Harus Berupa Tanggal : DD/MM/YYYY",
        "end_registration_date.required_if":
          "Tanggal Berakhir Registrasi Kegiatan Harus Diisi",
        "end_registration_date.date":
          "Tanggal Berakhir Registrasi Kegiatan Harus Berupa Tanggal : DD/MM/YYYY",
        "expired_date.required": "Tanggal Berakhir Kegiatan Harus Diisi",
        "expired_date.date":
          "Tanggal Berakhir Kegiatan Harus Berupa Tanggal : DD/MM/YYYY",
        "registration_url.url": "URL Registrasi Kegiatan Harus Berupa Link",
        "showed.required": "Kegiatan Ditampilkan Harus Diisi",
        "showed.in": "Kegiatan Ditampilkan Harus Diisi : member, atau public",
      };

      const validation = await validate(request.all(), rules, messages);

      if (validation.fails()) {
        return response.status(422).send(validation.messages()[0]);
      }

      const event_id = request.input("event_id");
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

      // Upload multi file
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

      if (files) {
        movedFiles.forEach(async (value) => {
          await EventFile.create({
            event_id: event_id,
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
        event_id: "required|integer",
      };

      const validation = await validate(request.all(), rules);

      if (validation.fails()) {
        return response.status(422).send(validation.messages()[0]);
      }

      // All input
      const event_id = request.input("event_id");

      // Check event if exist
      const findData = await Event.find(event_id);

      if (!findData) {
        return response.status(404).send({
          message: "Kegiatan Tidak Ditemukan",
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
        event_id: "required|integer",
      };

      const validation = await validate(request.all(), rules);

      if (validation.fails()) {
        return response.status(422).send(validation.messages()[0]);
      }

      // All input
      const event_id = request.input("event_id");

      // Check event if exist
      const findData = await Event.find(event_id);

      if (!findData) {
        return response.status(404).send({
          message: "Kegiatan Tidak Ditemukan",
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
        event_id: "required|integer",
      };

      const validation = await validate(request.all(), rules);

      if (validation.fails()) {
        return response.status(422).send(validation.messages()[0]);
      }

      const event_id = request.input("event_id");

      // Check event if exist
      const findData = await Event.find(event_id);

      if (!findData) {
        return response.status(404).send({
          message: "Kegiatan Tidak Ditemukan",
        });
      }

      let findImage = await EventFile.query()
        .where("event_id", event_id)
        .fetch();

      let convert = findImage.toJSON();

      convert.forEach((value) => {
        removeFile(path.join(value.path, value.name));
      });

      await EventFile.query().where("event_id", event_id).delete();
      await Event.query().where("id", event_id).delete();

      return response.send({
        message: "Kegiatan Berhasil Dihapus",
      });
    } catch (error) {
      console.log(error.message);
      return response.status(500).send(error.message);
    }
  }

  async destroyFile({ request, response }) {
    try {
      const rules = {
        file_id: "required|integer",
      };

      const validation = await validate(request.all(), rules);

      if (validation.fails()) {
        return response.status(422).send(validation.messages()[0]);
      }

      const file_id = request.input("file_id");

      let findFile = await EventFile.query().where("id", file_id).first();

      if (!findFile) {
        return response.status(404).send({
          message: "Berkas Tidak Ditemukan",
        });
      }

      removeFile(path.join(findFile.path, findFile.name));

      await EventFile.query().where("id", file_id).delete();

      return response.send({
        message: "Berkas Berhasil Dihapus",
      });
    } catch (error) {
      console.log(error.message);
      return response.status(500).send(error.message);
    }
  }
}

module.exports = EventController;
