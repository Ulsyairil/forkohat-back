"use strict";

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use("Model");

class CarouselPicture extends Model {
  static get table() {
    return "carousel_pictures";
  }
}

module.exports = CarouselPicture;
