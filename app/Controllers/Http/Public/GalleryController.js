"use strict";

const Gallery = use("App/Models/Gallery");

class GalleryController {
  async index({ request, response }) {
    try {
      const data = await Gallery.query().orderBy("id", "desc").fetch();

      return response.status(200).send(data);
    } catch (error) {
      console.log(error.message);
      return response.status(500).send(error.message);
    }
  }
}

module.exports = GalleryController;
