'use strict'

const Userfile = use('App/Models/UserFile')
const Program = use('App/Models/Program')
const Arrangement = use('App/Models/Arrangement')
const ArrangementItem = use('App/Models/ArrangementItem')
const News = use('App/Models/News')
const Event = use('App/Models/Event')
const EventFile = use('App/Models/EventFile')
const Gallery = use('App/Models/Gallery')
const Carousel = use('App/Models/Carousel')
const Helpers = use('Helpers')

class FileController {
  async index({ params, request, response }) {
    try {
      if (params.mime == null || params.mime == '') {
        return response.status(422).send({
          message: 'mime must be filled',
        })
      }

      if (params.filename == null || params.filename == '') {
        return response.status(422).send({
          message: 'filename must be filled',
        })
      }

      // User file
      let findUserFile = await Userfile.query()
        .where('mime', params.mime)
        .where('name', params.filename)
        .whereNull('deleted_at')
        .first()

      if (findUserFile) {
        return response.download(
          Helpers.resourcesPath(`uploads/users/${findUserFile.name}`)
        )
      }

      // Program image
      let findProgramImage = await Program.query()
        .where('image_mime', params.mime)
        .where('image_name', params.filename)
        .first()

      if (findProgramImage) {
        return response.download(
          Helpers.resourcesPath(
            `uploads/programs/${findProgramImage.image_name}`
          )
        )
      }

      // Arrangement image
      let findArrangementImage = await Arrangement.query()
        .where('image_mime', params.mime)
        .where('image_name', params.filename)
        .first()

      if (findArrangementImage) {
        return response.download(
          Helpers.resourcesPath(
            `uploads/arrangements/${findArrangementImage.image_name}`
          )
        )
      }

      // Arrangement Item file
      let findArrangementItemFile = await ArrangementItem.query()
        .where('file_mime', params.mime)
        .where('file_name', params.filename)
        .whereNull('deleted_at')
        .first()

      if (findArrangementItemFile) {
        return response.download(
          Helpers.resourcesPath(
            `uploads/orders/${findArrangementItemFile.file_name}`
          )
        )
      }

      // News image
      let findNewsImage = await News.query()
        .where('image_mime', params.mime)
        .where('image_name', params.filename)
        .whereNull('deleted_at')
        .first()

      if (findNewsImage) {
        return response.download(
          Helpers.resourcesPath(`uploads/news/${findNewsImage.image_name}`)
        )
      }

      // Event image
      let findEventImage = await Event.query()
        .where('image_mime', params.mime)
        .andWhere('image_name', params.filename)
        .whereNull('deleted_at')
        .first()

      if (findEventImage) {
        return response.download(
          Helpers.resourcesPath(`uploads/events/${findEventImage.image_name}`)
        )
      }
      // Event file
      let findEventFile = await EventFile.query()
        .where('mime', params.mime)
        .andWhere('name', params.filename)
        .first()

      if (findEventFile) {
        return response.download(
          Helpers.resourcesPath(`uploads/events/${findEventFile.name}`)
        )
      }

      // Gallery image
      let findGallery = await Gallery.query()
        .where('image_mime', params.mime)
        .andWhere('image_name', params.filename)
        .first()

      if (findGallery) {
        return response.download(
          Helpers.resourcesPath(`uploads/gallery/${findGallery.image_name}`)
        )
      }

      // Carousel image
      let findCarousel = await Carousel.query()
        .where('image_mime', params.mime)
        .andWhere('image_name', params.filename)
        .first()

      if (findCarousel) {
        return response.download(
          Helpers.resourcesPath(`uploads/carousel/${findCarousel.image_name}`)
        )
      }

      return response.status(404).send({
        message: 'not found',
      })
    } catch (error) {
      console.log(error.message)
      return response.status(500).send(error.message)
    }
  }
}

module.exports = FileController
