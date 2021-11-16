"use strict";

const Helpers = use("Helpers");
const fs = use("fs");
const path = use("path");
const removeFile = Helpers.promisify(fs.unlink);
const ArrangementItem = use("App/Models/ArrangementItem");
const Arrangement = use("App/Models/Arrangement");
const RandomString = require("randomstring");
const Moment = require("moment");
const voca = require("voca");
const { validate } = use("Validator");

class ArrangementItemController {
  async index({ request, response }) {
    try {
      // Validate request
      const rules = {
        arrangement_id: "required|integer",
        page: "required|integer",
        limit: "required|integer",
        order: "required|in:asc,desc",
        search: "string",
        showed: "required|in:public,member,private",
        trash: "required|boolean",
      };

      const validation = await validate(request.all(), rules);

      if (validation.fails()) {
        return response.status(422).send(validation.messages()[0]);
      }

      // All input
      const arrangement_id = request.input("arrangement_id");
      const page = request.input("page");
      const limit = request.input("limit");
      const order = request.input("order");
      const search = request.input("search");
      const showed = request.input("showed");
      const trash = request.input("trash");

      // Find arrangement
      let findArrangement = await Arrangement.find(arrangement_id);

      // Check arrangement exist
      if (!findArrangement) {
        return response.status(404).send({
          message: "Tatanan Tidak Ditemukan",
        });
      }

      // Arrangement item query
      let query = ArrangementItem.query()
        .with("Arrangement")
        .with("UploadedBy")
        .with("UpdatedBy");

      // Search arrangement item query
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

      // Get arrangement item data
      const data = await query
        .where("arrangement_id", arrangement_id)
        .where("showed", showed)
        .orderBy("id", order)
        .paginate(page, limit);
      console.log(data);

      return response.status(200).send(data);
    } catch (error) {
      console.log(error.message);
      return response.status(500).send(error.message);
    }
  }

  async get({ request, response }) {
    try {
      // Validate request
      const rules = {
        arrangement_item_id: "required|integer",
      };

      const validation = await validate(request.all(), rules);

      if (validation.fails()) {
        return response.status(422).send(validation.messages()[0]);
      }

      // All input
      const arrangement_item_id = request.input("arrangement_item_id");

      // Find data
      let data = await ArrangementItem.query()
        .where("id", arrangement_item_id)
        .first();

      // Check if data exist
      if (!data) {
        return response.status(404).send({
          message: "Isi Tatanan Tidak Ditemukan",
        });
      }

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
        arrangement_id: "required|integer",
        title: "required|string",
        description: "string",
        showed: "required|in:public,member,private",
      };

      const messages = {
        "arrangement_id.required": "ID Tatanan Harus Diisi",
        "arrangement_id.integer": "ID Tatanan Harus Berupa Angka",
        "title.required": "Judul Isi Tatanan Harus Diisi",
        "showed.required": "Isi Tatanan Ditampilkan Harus Diisi",
        "showed.in":
          "Isi Tatanan Ditampilkan Hanya Dapat Diisi : public, member, dan private",
      };

      const validation = await validate(request.all(), rules, messages);

      if (validation.fails()) {
        return response.status(422).send(validation.messages()[0]);
      }

      // All input
      const arrangement_id = request.input("arrangement_id");
      const title = request.input("title");
      const description = request.input("description");
      const showed = request.input("showed");
      const file = request.file("file", {
        extnames: ["pdf"],
      });

      // Get user data logged in
      const user = await auth.getUser();

      // Check if input file is null
      if (file == null) {
        return response.status(422).send({
          message: "Berkas Harus Diunggah",
        });
      }

      let random = RandomString.generate({
        capitalization: "lowercase",
      });

      let fileName = `${voca.snakeCase(
        file.clientName.split(".").slice(0, -1).join(".")
      )}_${random}.${file.extname}`;

      await file.move(Helpers.resourcesPath("uploads/arrangements"), {
        name: fileName,
      });

      if (!file.moved()) {
        return response.status(422).send(file.error());
      }

      let create = await ArrangementItem.create({
        arrangement_id: arrangement_id,
        uploaded_by: user.id,
        updated_by: user.id,
        title: title,
        description: description,
        file_name: fileName,
        file_mime: file.extname,
        file_path: Helpers.resourcesPath("uploads/arrangements"),
        file_url: `/api/v1/file/${file.extname}/${fileName}`,
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
        arrangement_item_id: "required|integer",
        title: "required|string",
        description: "string",
        showed: "required|in:public,member,private",
      };

      const messages = {
        "arrangement_item_id.required": "ID Isi Tatanan Harus Diisi",
        "arrangement_item_id.integer": "ID Isi Tatanan Harus Berupa Angka",
        "title.required": "Judul Isi Tatanan Harus Diisi",
        "showed.required": "Isi Tatanan Ditampilkan Harus Diisi",
        "showed.in":
          "Isi Tatanan Ditampilkan Hanya Dapat Diisi : public, member, dan private",
      };

      const validation = await validate(request.all(), rules, messages);

      if (validation.fails()) {
        return response.status(422).send(validation.messages()[0]);
      }

      // All input
      const arrangement_item_id = request.input("arrangement_item_id");
      const title = request.input("title");
      const description = request.input("description");
      const showed = request.input("showed");
      const file = request.file("file", {
        extnames: ["pdf"],
      });

      // Get user data logged in
      const user = await auth.getUser();

      // Find data
      let findData = await ArrangementItem.query()
        .where("id", arrangement_item_id)
        .first();

      // Check data exist
      if (!findData) {
        return response.status(404).send({
          message: "Isi Tatanan Tidak Ditemukan",
        });
      }

      let query = ArrangementItem.query().where("id", arrangement_item_id);

      if (file != null) {
        let random = RandomString.generate({
          capitalization: "lowercase",
        });

        // Delete file
        removeFile(
          path.join(
            Helpers.resourcesPath("uploads/arrangements"),
            findData.file_name
          )
        );

        // Move file
        let fileName = `${voca.snakeCase(
          file.clientName.split(".").slice(0, -1).join(".")
        )}_${random}.${file.extname}`;

        await file.move(Helpers.resourcesPath("uploads/arrangements"), {
          name: fileName,
        });

        if (!file.moved()) {
          return response.status(422).send(file.error());
        }

        // Update query with file uploaded
        await query.update({
          updated_by: user.id,
          title: title,
          description: description,
          file_name: fileName,
          file_mime: file.extname,
          file_path: Helpers.resourcesPath("uploads/arrangements"),
          file_url: `/api/v1/file/${file.extname}/${fileName}`,
          showed: showed,
        });
      } else {
        // Update query
        await query.update({
          updated_by: user.id,
          title: title,
          description: description,
          showed: showed,
        });
      }

      // Get data updated
      let data = await ArrangementItem.query()
        .where("id", arrangement_item_id)
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
        arrangement_item_id: "required|integer",
      };

      const validation = await validate(request.all(), rules);

      if (validation.fails()) {
        return response.status(422).send(validation.messages()[0]);
      }

      // All input
      const arrangement_item_id = request.input("arrangement_item_id");

      // Find data
      let findData = await ArrangementItem.query()
        .where("id", arrangement_item_id)
        .first();

      // Check data exist
      if (!findData) {
        return response.status(404).send({
          message: "Isi Tatanan Tidak Ditemukan",
        });
      }

      // Dump data
      await ArrangementItem.query().where("id", arrangement_item_id).update({
        deleted_at: Moment.now(),
      });

      // Get dumped data
      let data = await ArrangementItem.query()
        .where("id", arrangement_item_id)
        .first();

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
        arrangement_item_id: "required|integer",
      };

      const validation = await validate(request.all(), rules);

      if (validation.fails()) {
        return response.status(422).send(validation.messages()[0]);
      }

      // All input
      const arrangement_item_id = request.input("arrangement_item_id");

      // Find data
      let findData = await ArrangementItem.query()
        .where("id", arrangement_item_id)
        .first();

      // Check data exist
      if (!findData) {
        return response.status(404).send({
          message: "Isi Tatanan Tidak Ditemukan",
        });
      }

      // Restore data
      await ArrangementItem.query().where("id", arrangement_item_id).update({
        deleted_at: null,
      });

      // Get restored data
      let data = await ArrangementItem.query()
        .where("id", arrangement_item_id)
        .first();

      return response.send(data);
    } catch (error) {
      console.log(error.message);
      return response.status(500).send(error.message);
    }
  }

  async destroy({ request, response }) {
    try {
      // Validate request
      const rules = {
        arrangement_item_id: "required|integer",
      };

      const validation = await validate(request.all(), rules);

      if (validation.fails()) {
        return response.status(422).send(validation.messages()[0]);
      }

      // All input
      const arrangement_item_id = request.input("arrangement_item_id");

      // Find data
      let findData = await ArrangementItem.query()
        .where("id", arrangement_item_id)
        .first();

      // Check data exist
      if (!findData) {
        return response.status(404).send({
          message: "Isi Tatanan Tidak Ditemukan",
        });
      }

      // Delete file saved
      removeFile(
        path.join(
          Helpers.resourcesPath("uploads/arrangements"),
          findData.file_name
        )
      );

      // Destroy data
      await ArrangementItem.query().where("id", arrangement_item_id).delete();

      return response.send({
        message: "Isi Tatanan Berhasil Dihapus",
      });
    } catch (error) {
      console.log(error.message);
      return response.status(500).send(error.message);
    }
  }
}

module.exports = ArrangementItemController;
