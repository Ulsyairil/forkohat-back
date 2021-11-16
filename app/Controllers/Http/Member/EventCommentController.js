"use strict";

const EventComment = use("App/Models/EventComment");
const Event = use("App/Models/Event");
const { validate } = use("Validator");

class EventCommentController {
  async index({ request, response }) {
    try {
      const rules = {
        event_id: "required|integer",
        page: "required|integer",
        limit: "required|integer",
        order: "required|in:asc,desc",
        search: "string",
      };

      const validation = await validate(request.all(), rules);

      if (validation.fails()) {
        return response.status(422).send(validation.messages()[0]);
      }

      const event_id = request.input("event_id");
      const page = request.input("page");
      const limit = request.input("limit");
      const order = request.input("order");
      const search = request.input("search");

      const findEvent = await Event.find(event_id);

      if (!findEvent) {
        return response.status(404).send({
          message: "Kegiatan Tidak Ditemukan",
        });
      }

      let query = EventComment.query();

      if (search) {
        query.where("comment", "like", `%${search}%`);
      }

      const data = await query
        .with("User")
        .where("event_id", event_id)
        .orderBy("id", order)
        .paginate(page, limit);

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
        event_comment_id: "required|integer",
      };

      const validation = await validate(request.all(), rules);

      if (validation.fails()) {
        return response.status(422).send(validation.messages()[0]);
      }

      const event_comment_id = request.input("event_comment_id");

      let data = await EventComment.query()
        .with("User")
        .where("id", event_comment_id)
        .first();

      if (!data) {
        return response.status(400).send({
          message: "Komentar Kegiatan Tidak Ditemukan",
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
      // Validate request
      const rules = {
        event_id: "required|integer",
        comment: "required|string",
      };

      const messages = {
        "event_id.required": "ID Kegiatan Harus Diisi",
        "event_id.integer": "ID Kegiatan Harus Berupa Angka",
        "comment.required": "Komentar Kegiatan Harus Diisi",
      };

      const validation = await validate(request.all(), rules, messages);

      if (validation.fails()) {
        return response.status(422).send(validation.messages()[0]);
      }

      const comment = request.input("comment");
      const event_id = request.input("event_id");
      const user = await auth.getUser();

      const findEvent = await Event.find(event_id);

      if (!findEvent) {
        return response.status(404).send({
          message: "Kegiatan Tidak Ditemukan",
        });
      }

      let create = await EventComment.create({
        user_id: user.id,
        event_id: event_id,
        comment: comment,
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
        event_comment_id: "required|integer",
        comment: "required|string",
      };

      const messages = {
        "event_comment_id.required": "ID Komentar Kegiatan Harus Diisi",
        "event_comment_id.integer": "ID Komentar Kegiatan Harus Berupa Angka",
        "comment.required": "Komentar Kegiatan Harus Diisi",
      };

      const validation = await validate(request.all(), rules, messages);

      if (validation.fails()) {
        return response.status(422).send(validation.messages()[0]);
      }

      const event_comment_id = request.input("event_comment_id");
      const comment = request.input("comment");
      const user = await auth.getUser();

      const findEventComment = await EventComment.query()
        .where("id", event_comment_id)
        .where("user_id", user.id)
        .first();

      if (!findEventComment) {
        return response.status(404).send({
          message: "Komentar Kegiatan Tidak Ditemukan",
        });
      }

      let create = await EventComment.query()
        .where("id", event_comment_id)
        .where("user_id", user.id)
        .update({
          comment: comment,
        });

      const updatedData = await EventComment.query()
        .where("id", event_comment_id)
        .where("user_id", user.id)
        .first();

      return response.send(updatedData);
    } catch (error) {
      console.log(error.message);
      return response.status(500).send(error.message);
    }
  }

  async destroy({ auth, request, response }) {
    try {
      // Validate request
      const rules = {
        event_comment_id: "required|integer",
      };

      const validation = await validate(request.all(), rules);

      if (validation.fails()) {
        return response.status(422).send(validation.messages()[0]);
      }

      const event_comment_id = request.input("event_comment_id");
      const user = await auth.getUser();

      const findEventComment = await EventComment.query()
        .where("id", event_comment_id)
        .where("user_id", user.id)
        .first();

      if (!findEventComment) {
        return response.status(404).send({
          message: "Komentar Kegiatan Tidak Ditemukan",
        });
      }

      await EventComment.query()
        .where("id", event_comment_id)
        .where("user_id", user.id)
        .delete();

      return response.send({
        message: "Komentar Kegiatan Berhasil Dihapus",
      });
    } catch (error) {
      console.log(error.message);
      return response.status(500).send(error.message);
    }
  }
}

module.exports = EventCommentController;
