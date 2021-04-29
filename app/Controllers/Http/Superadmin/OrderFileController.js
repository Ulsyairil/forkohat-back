'use strict';

const Helpers = use('Helpers');
const fs = use('fs');
const path = use('path');
const removeFile = Helpers.promisify(fs.unlink);
const OrderFile = use('App/Models/OrderFile');
const RandomString = use('randomstring');
const Moment = use('moment');
const { validateAll } = use('Validator');

class OrderFileController {
  async index({ request, response }) {
    try {
      let data = await OrderFile.query()
        .where('order_stuff_id', request.input('order_stuff_id'))
        .orderBy('page', 'asc')
        .fetch();

      return response.send(data);
    } catch (error) {
      console.log(error);
      return response.status(500).send(error);
    }
  }

  async checkImageRequest({ request, response }) {
    try {
      let inputImage = request.file('image', {
        size: '5mb',
        extnames: ['png', 'jpg', 'jpeg'],
      });

      if (!inputImage) {
        return response.status(422).send(inputImage.errors());
      }

      return response.send({
        message: 'success',
      });
    } catch (error) {
      console.log(error);
      return response.status(500).send(error);
    }
  }

  async create({ request, response }) {
    try {
      let inputImage = request.file('image');

      let fileName = `${RandomString.generate()}.${inputImage.subtype}`;

      await inputImage.move(Helpers.resourcesPath('uploads/orders'), {
        name: fileName,
      });

      if (!inputImage.moved()) {
        return response.status(422).send(inputImage.errors());
      }

      let create = await OrderFile.create({
        order_stuff_id: request.input('order_stuff_id'),
        page: request.input('page'),
        name: fileName,
        mime: inputImage.subtype,
        path: Helpers.resourcesPath('uploads/orders'),
        url: `/api/v1/file/${inputImage.subtype}/${fileName}`,
      });

      return response.send(create);
    } catch (error) {
      console.log(error);
      return response.status(500).send(error);
    }
  }

  async edit({ request, response }) {
    try {
      let inputImage = request.file('image', {
        size: '5mb',
        extnames: ['png', 'jpg', 'jpeg'],
      });

      if (inputImage) {
        let findImage = await OrderFile.query()
          .where('id', request.input('id'))
          .first();

        // Delete image and data if exists
        if (findImage) {
          removeFile(
            path.join(Helpers.resourcesPath('uploads/orders'), findImage.name)
          );
        }

        let fileName = `${RandomString.generate()}.${inputImage.subtype}`;

        await inputImage.move(Helpers.resourcesPath('uploads/orders'), {
          name: fileName,
        });

        if (!inputImage.moved()) {
          return response.status(422).send(inputImage.errors());
        }

        await OrderFile.query()
          .where('id', request.input('id'))
          .update({
            page: request.input('page'),
            name: fileName,
            mime: inputImage.subtype,
            url: `/api/v1/file/${inputImage.subtype}/${fileName}`,
          });
      }

      if (!inputImage) {
        await OrderFile.query()
          .where('id', request.input('id'))
          .update({
            page: request.input('page'),
          });
      }

      let data = await OrderFile.query()
        .where('id', request.input('id'))
        .first();

      return response.send(data);
    } catch (error) {
      console.log(error);
      return response.status(500).send(error);
    }
  }

  async dump({ request, response }) {
    try {
      await OrderFile.query().where('id', request.input('id')).update({
        deleted_at: Moment.now(),
      });

      let data = await OrderFile.query()
        .where('id', request.input('id'))
        .first();

      return response.send(data);
    } catch (error) {
      console.log(error);
      return response.status(500).send(error);
    }
  }

  async restore({ request, response }) {
    try {
      await OrderFile.query().where('id', request.input('id')).update({
        deleted_at: null,
      });

      let data = await OrderFile.query()
        .where('id', request.input('id'))
        .first();

      return response.send(data);
    } catch (error) {
      console.log(error);
      return response.status(500).send(error);
    }
  }

  async delete({ request, response }) {
    try {
      let findImage = await OrderFile.query()
        .where('id', request.input('id'))
        .first();

      // Delete image and data if exists
      if (findImage) {
        removeFile(
          path.join(Helpers.resourcesPath('uploads/orders'), findImage.name)
        );
      }

      await OrderFile.query().where('id', findImage.id).delete();

      return response.send();
    } catch (error) {
      console.log(error);
      return response.status(500).send(error);
    }
  }
}

module.exports = OrderFileController;
