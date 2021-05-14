'use strict';

const Helpers = use('Helpers');
const fs = use('fs');
const path = use('path');
const removeFile = Helpers.promisify(fs.unlink);
const User = use('App/Models/User');
const UserFile = use('App/Models/UserFile');
const RandomString = require('randomstring');
const Hash = use('Hash');
const Voca = require('voca');

class ProfileController {
  async index({ auth, request, response }) {
    try {
      let user = await auth.getUser();
      let data = await User.query()
        .with('rules')
        .with('programRuled')
        .with('programRuled.programs')
        .with('userFiles', (builder) => {
          builder.where('user_id', user.id).whereNull('deleted_at');
        })
        .where('id', user.id)
        .first();

      return response.send(data);
    } catch (error) {
      console.log(error);
      return response.status(500).send(error);
    }
  }

  async edit({ auth, request, response }) {
    try {
      let user = await auth.getUser();
      let payload = {
        name: request.input('name'),
        email: request.input('email'),
        nip: request.input('nip'),
        job: Voca.upperCase(request.input('job')),
        district: request.input('district'),
        sub_district: request.input('sub_district'),
        gender: request.input('gender'),
        bio: Voca.capitalize(request.input('bio')),
      };

      if (request.input('confirm_password')) {
        payload.password = await Hash.make(request.input('confirm_password'));
      }

      await User.query().where('id', user.id).update(payload);

      let data = await User.query().where('id', user.id).first();

      return response.send(data);
    } catch (error) {
      console.log(error);
      return response.status(500).send(error);
    }
  }

  async changeImage({ auth, request, response }) {
    try {
      let user = await auth.getUser();
      let inputImage = request.file('image', {
        size: '2mb',
        extnames: ['png', 'jpg', 'jpeg'],
      });

      let findImage = await UserFile.query()
        .where('user_id', user.id)
        .andWhere('type', 'profile_picture')
        .first();

      // Delete image and data if exists
      if (findImage) {
        removeFile(
          path.join(Helpers.resourcesPath('uploads/users'), findImage.name)
        );

        await UserFile.query().where('id', findImage.id).delete();
      }

      fileName = `${Voca.snakeCase(
        inputImage.clientName.split('.').slice(0, -1).join('.')
      )}_${random}.${inputImage.extname}`;

      await inputImage.move(Helpers.resourcesPath('uploads/users'), {
        name: fileName,
      });

      if (!inputImage.moved()) {
        return response.status(422).send(inputImage.errors());
      }

      let create = await UserFile.create({
        user_id: user.id,
        type: 'profile_picture',
        name: fileName,
        mime: inputImage.extname,
        path: Helpers.resourcesPath('uploads/users'),
        url: `/api/v1/file/${inputImage.extname}/${fileName}`,
      });

      return response.send(create);
    } catch (error) {
      console.log(error);
      return response.status(500).send(error);
    }
  }
}

module.exports = ProfileController;
