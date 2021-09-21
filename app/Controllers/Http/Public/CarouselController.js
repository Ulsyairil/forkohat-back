"use strict";

const CarouselPicture = use("App/Models/CarouselPicture");

class CarouselController {
  async index({ request, response }) {
    try {
      const data = await CarouselPicture.query().orderBy("id", "desc").fetch();

      return response.status(200).send(data);
    } catch (error) {
      console.log(error.message);
      return response.status(500).send(error.message);
    }
  }
}

module.exports = CarouselController;
