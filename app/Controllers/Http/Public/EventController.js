"use strict";

const Event = use("App/Models/Event");

class EventController {
  async index({ request, response }) {
    try {
      let query = Event.query()
        .with("users", (builder) => {
          builder.select("id", "name").where("deleted_at", null);
        })
        .with("eventFiles", (builder) => {
          builder.where("type", "banner").where("deleted_at", null);
        });

      if (request.input("search") != null) {
        query
          .where("name", "like", `%${request.input("search")}%`)
          .orWhere("content", "like", `%${request.input("search")}%`)
          .orWhere("registration_date", "like", `%${request.input("search")}%`)
          .orWhere("expired_date", "like", `%${request.input("search")}%`);
      }

      if (request.input("order_id") != null) {
        query
          .where("order_id", request.input("order_id"))
          .where("showed", "public");
      }

      let data = await query
        .where("deleted_at", null)
        .orderBy("id", "desc")
        .paginate(request.input("page"), request.input("limit"));
      console.log(data.toJSON());

      return response.send(data.toJSON());
    } catch (error) {
      console.log(error.message);
      return response.status(500).send(error.message);
    }
  }

  async get({ request, response }) {
    try {
      let data = await Event.query()
        .with("users", (builder) => {
          builder.select("id", "name").where("deleted_at", null);
        })
        .with("eventFiles", (builder) => {
          builder.where("deleted_at", null);
        })
        .where("id", request.input("id"))
        .where("deleted_at", null)
        .first();
      console.log(data);

      if (data == null) {
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
}

module.exports = EventController;