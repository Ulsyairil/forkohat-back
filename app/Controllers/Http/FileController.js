'use strict';

const Userfile = use('App/Models/UserFile');
const ProgramFile = use('App/Models/ProgramFile');
const OrderFile = use('App/Models/OrderFile');
const NewsFile = use('App/Models/NewsFile');
const EventFile = use('App/Models/EventFile');
const Helpers = use('Helpers');

class FileController {
  async index({ params, request, response }) {
    try {
      // User file
      let findUserFile = await Userfile.query()
        .where('mime', params.mime)
        .where('name', params.filename)
        .whereNull('deleted_at')
        .first();

      if (findUserFile) {
        return response.download(
          Helpers.resourcesPath(`uploads/users/${findUserFile.name}`)
        );
      }

      // Program file
      let findProgramFile = await ProgramFile.query()
        .where('mime', params.mime)
        .where('name', params.filename)
        .whereNull('deleted_at')
        .first();

      if (findProgramFile) {
        return response.download(
          Helpers.resourcesPath(`uploads/programs/${findProgramFile.name}`)
        );
      }

      // Order file
      let findOrderFile = await OrderFile.query()
        .where('mime', params.mime)
        .where('name', params.filename)
        .whereNull('deleted_at')
        .first();

      if (findOrderFile) {
        return response.download(
          Helpers.resourcesPath(`uploads/orders/${findOrderFile.name}`)
        );
      }

      // News file
      let findNewsFile = await NewsFile.query()
        .where('mime', params.mime)
        .where('name', params.filename)
        .whereNull('deleted_at')
        .first();

      if (findNewsFile) {
        return response.download(
          Helpers.resourcesPath(`uploads/news/${findNewsFile.name}`)
        );
      }

      // Event file
      let findEventFile = await EventFile.query()
        .where('mime', params.mime)
        .andWhere('name', params.filename)
        .whereNull('deleted_at')
        .first();

      if (findEventFile) {
        return response.download(
          Helpers.resourcesPath(`uploads/events/${findEventFile.name}`)
        );
      }

      return response.status(404).send({
        message: 'not found',
      });
    } catch (error) {
      console.log(error);
      return response.status(500).send(error);
    }
  }
}

module.exports = FileController;
