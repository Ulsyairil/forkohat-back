"use strict";

const ArrangementItem = use("App/Models/ArrangementItem");
const Arrangement = use("App/Models/Arrangement");
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

      // Find arrangement
      let findArrangement = await Arrangement.find(arrangement_id);

      // Check arrangement exist
      if (!findArrangement) {
        return response.status(404).send({
          message: "Tatanan not exist",
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

      // Get arrangement item data
      const data = await query
        .where("arrangement_id", arrangement_id)
        .where("showed", "public")
        .whereNull("deleted_at")
        .orderBy("id", order)
        .paginate(page, limit);

      return response.status(200).send(data);
    } catch (error) {
      console.log(error.message);
      return response.status(500).send(error.message);
    }
  }
}

module.exports = ArrangementItemController;
