"use strict";

const Carousel = use("App/Models/Carousel");

class CarouselController {
  async index({ request, response }) {
    try {
      const data = await Carousel.query()
        .where("showed", 1)
        .orderBy("id", "asc")
        .fetch();

      return response.status(200).send(data);
    } catch (error) {
      console.log(error.message);
      return response.status(500).send(error.message);
    }
  }
}

module.exports = CarouselController;
