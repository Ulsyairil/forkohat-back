'use strict';

const Helpers = use('Helpers');
const fs = use('fs');
const path = use('path');
const removeFile = Helpers.promisify(fs.unlink);
const Program = use('App/Models/Program');
const ProgramFile = use('App/Models/ProgramFile');
const RandomString = require('randomstring');
const Moment = require('moment');
const voca = require('voca');

class ProgramController {
  async index({ request, response }) {
    try {
      let data = await Program.query().orderBy('id', 'desc').fetch();
      console.log(data);

      return response.send(data);
    } catch (error) {
      console.log(error);
      return response.status(500).send(error);
    }
  }

  async get({ request, response }) {
    try {
      let data = await Program.query()
        .with('programFiles')
        .where('id', request.input('program_id'))
        .first();

      if (!data) {
        return response.status(404).send({
          message: 'not found',
        });
      }

      return response.send(data);
    } catch (error) {
      console.log(error);
      return response.status(500).send(error);
    }
  }

  async create({ request, response }) {
    try {
      let fileName;
      // Upload image
      let inputImage = request.file('image');
      let random = RandomString.generate({
        capitalization: 'lowercase',
      });

      if (inputImage) {
        fileName = `${voca.snakeCase(
          inputImage.clientName.split('.').slice(0, -1).join('.')
        )}_${random}.${inputImage.extname}`;

        await inputImage.move(Helpers.resourcesPath('uploads/programs'), {
          name: fileName,
        });

        if (!inputImage.moved()) {
          return response.status(422).send(inputImage.errors());
        }
      }

      // Insert to programs table
      let program = await Program.create({
        name: request.input('name'),
        description: request.input('description'),
      });

      if (inputImage) {
        await ProgramFile.create({
          program_id: program.id,
          name: fileName,
          mime: inputImage.extname,
          path: Helpers.resourcesPath('uploads/programs'),
          url: `/api/v1/file/${inputImage.extname}/${fileName}`,
        });
      }

      // Get data created
      let data = await Program.query()
        .with('programFiles')
        .where('id', program.id)
        .first();

      return response.send(data);
    } catch (error) {
      console.log(error);
      return response.status(500).send(error);
    }
  }

  async edit({ request, response }) {
    try {
      let fileName;
      let random = RandomString.generate({
        capitalization: 'lowercase',
      });

      // Upload image
      let inputImage = request.file('image', {
        size: '5mb',
        extnames: ['png', 'jpg', 'jpeg'],
      });

      if (inputImage) {
        let findImage = await ProgramFile.query()
          .where('program_id', request.input('program_id'))
          .first();

        // Delete image and data if exists
        if (findImage) {
          removeFile(
            path.join(Helpers.resourcesPath('uploads/programs'), findImage.name)
          );

          await ProgramFile.query().where('id', findImage.id).delete();
        }

        fileName = `${voca.snakeCase(
          inputImage.clientName.split('.').slice(0, -1).join('.')
        )}_${random}.${inputImage.extname}`;

        await inputImage.move(Helpers.resourcesPath('uploads/programs'), {
          name: fileName,
        });

        if (!inputImage.moved()) {
          return response.status(422).send(inputImage.errors());
        }
      }

      // Insert to programs table
      await Program.query()
        .where('id', request.input('program_id'))
        .update({
          name: request.input('name'),
          description: request.input('description'),
        });

      if (inputImage) {
        await ProgramFile.create({
          program_id: request.input('program_id'),
          name: fileName,
          mime: inputImage.extname,
          path: Helpers.resourcesPath('uploads/programs'),
          url: `/api/v1/file/${inputImage.extname}/${fileName}`,
        });
      }

      // Get data created
      let data = await Program.query()
        .with('programFiles')
        .where('id', request.input('program_id'))
        .first();

      return response.send(data);
    } catch (error) {
      console.log(error);
      return response.status(500).send(error);
    }
  }

  async dump({ request, response }) {
    try {
      await Program.query().where('id', request.input('program_id')).update({
        deleted_at: Moment.now(),
      });

      // Get data created
      let data = await Program.query()
        .with('programFiles')
        .where('id', request.input('program_id'))
        .first();

      return response.send(data);
    } catch (error) {
      console.log(error);
      return response.status(500).send(error);
    }
  }

  async restore({ request, response }) {
    try {
      await Program.query().where('id', request.input('program_id')).update({
        deleted_at: null,
      });

      // Get data created
      let data = await Program.query()
        .with('programFiles')
        .where('id', request.input('program_id'))
        .first();

      return response.send(data);
    } catch (error) {
      console.log(error);
      return response.status(500).send(error);
    }
  }

  async delete({ request, response }) {
    try {
      let findImage = await ProgramFile.query()
        .where('program_id', request.input('program_id'))
        .fetch();

      let convert = findImage.toJSON();

      convert.forEach((value) => {
        removeFile(path.join(value.path, value.name));
      });

      await ProgramFile.query()
        .where('program_id', request.input('program_id'))
        .delete();

      await Program.query().where('id', request.input('program_id')).delete();

      return response.send({
        message: 'deleted',
      });
    } catch (error) {
      console.log(error);
      return response.status(500).send(error);
    }
  }
}

module.exports = ProgramController;
