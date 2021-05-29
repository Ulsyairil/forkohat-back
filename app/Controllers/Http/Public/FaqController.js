"use strict";

const Faq = use("App/Models/Faq");

class FaqController {
  async index({ request, response }) {
    try {
      let data = await Faq.query()
        .with("faqTopics", (builder) => {
          builder.where("deleted_at", null).orderBy("id", "asc");
        })
        .where("deleted_at", null)
        .orderBy("id", "asc")
        .fetch();
      console.log(data);

      return response.send(data);
    } catch (error) {
      console.log(error);
      return response.status(500).send(error);
    }
  }
}

module.exports = FaqController;
