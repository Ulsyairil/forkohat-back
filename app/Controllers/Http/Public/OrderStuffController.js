"use strict";

const OrderStuff = use("App/Models/OrderStuff");

class OrderStuffController {
  async index({ request, response }) {
    try {
      let query = OrderStuff.query().with("orderStuffFiles", (builder) => {
        builder
          .where("page", 1)
          .where("deleted_at", null)
          .orderBy("page", "asc");
      });

      console.log(request.input("search"));

      if (request.input("search") != null) {
        query
          .where("name", "like", `%${request.input("search")}%`)
          .orWhere("description", "like", `%${request.input("search")}%`);
      }

      let data = await query
        .where("order_id", request.input("order_id"))
        .where("deleted_at", null)
        .orderBy("id", "desc")
        .paginate(request.input("page"), request.input("limit"));
      console.log(data.toJSON());

      return response.send(data.toJSON());
    } catch (error) {
      console.log(error);
      return response.status(500).send(error);
    }
  }

  async get({ request, response }) {
    try {
      let data = await OrderStuff.query()
        .with("orderStuffFiles", (builder) => {
          builder.where("deleted_at", null).orderBy("page", "asc");
        })
        .where("id", request.input("id"))
        .where("deleted_at", null)
        .first();
      console.log(data);

      if (data == null) {
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
}

module.exports = OrderStuffController;
