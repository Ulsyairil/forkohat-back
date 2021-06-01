"use strict";

const Helpers = use("Helpers");
const fs = use("fs");
const path = use("path");
const removeFile = Helpers.promisify(fs.unlink);
const User = use("App/Models/User");
const UserFile = use("App/Models/UserFile");
const RandomString = require("randomstring");
const Moment = require("moment");
const Hash = use("Hash");
const voca = require("voca");

class UserController {
  async index({ auth, request, response }) {
    try {
      let user = await auth.getUser();
      let data = await User.query()
        .with("rules")
        .whereNot("id", user.id)
        .orderBy("id", "desc")
        .fetch();
      console.log(data);

      return response.send(data);
    } catch (error) {
      console.log(error.message);
      return response.status(500).send(error.message);
    }
  }

  async get({ request, response }) {
    try {
      let data = await User.query()
        .with("rules")
        .with("userFiles")
        .where("id", request.input("id"))
        .first();

      if (!data) {
        return response.status(404).send({
          message: "not found",
        });
      }

      return response.send(data);
    } catch (error) {
      console.log(error.message);
      return response.status(500).send(error.message);
    }
  }

  async create({ request, response }) {
    try {
      let fileName;
      let random = RandomString.generate({
        capitalization: "lowercase",
      });

      // Upload image
      let inputImage = request.file("image", {
        size: "2mb",
        extnames: ["png", "jpg", "jpeg"],
      });

      if (inputImage) {
        fileName = `${voca.snakeCase(
          inputImage.clientName.split(".").slice(0, -1).join(".")
        )}_${random}.${inputImage.extname}`;

        await inputImage.move(Helpers.resourcesPath("uploads/users"), {
          name: fileName,
        });

        if (!inputImage.moved()) {
          return response.status(422).send(inputImage.errors());
        }
      }

      // Insert to users table
      let user = await User.create({
        rule_id: request.input("rule_id"),
        name: request.input("name"),
        email: request.input("email"),
        nip: request.input("nip"),
        password: request.input("password"),
        job: request.input("job"),
        district: request.input("district"),
        sub_district: request.input("sub_district"),
        gender: request.input("gender"),
        bio: request.input("bio"),
      });

      if (inputImage) {
        await UserFile.create({
          user_id: user.id,
          type: "profile_picture",
          name: fileName,
          mime: inputImage.extname,
          path: Helpers.resourcesPath("uploads/users"),
          url: `/api/v1/file/${inputImage.extname}/${fileName}`,
        });
      }

      // Get data created
      let data = await User.query()
        .with("rules")
        .with("userFiles")
        .where("id", user.id)
        .first();

      return response.send(data);
    } catch (error) {
      console.log(error.message);
      return response.status(500).send(error.message);
    }
  }

  async edit({ request, response }) {
    try {
      let random = RandomString.generate({
        capitalization: "lowercase",
      });

      // Upload image
      let inputImage = request.file("image", {
        size: "2mb",
        extnames: ["png", "jpg", "jpeg"],
      });

      if (inputImage) {
        let findImage = await UserFile.query()
          .where("user_id", request.input("id"))
          .andWhere("type", "profile_picture")
          .first();

        // Delete image and data if exists
        if (findImage) {
          removeFile(
            path.join(Helpers.resourcesPath("uploads/users"), findImage.name)
          );

          await UserFile.query().where("id", findImage.id).delete();
        }

        let fileName = `${voca.snakeCase(
          inputImage.clientName.split(".").slice(0, -1).join(".")
        )}_${random}.${inputImage.extname}`;

        await inputImage.move(Helpers.resourcesPath("uploads/users"), {
          name: fileName,
        });

        if (!inputImage.moved()) {
          return response.status(422).send(inputImage.errors());
        }

        await UserFile.create({
          user_id: request.input("id"),
          type: "profile_picture",
          name: fileName,
          mime: inputImage.extname,
          path: Helpers.resourcesPath("uploads/users"),
          url: `/api/v1/file/${inputImage.extname}/${fileName}`,
        });
      }

      // Insert to users table
      await User.query()
        .where("id", request.input("id"))
        .update({
          rule_id: request.input("rule_id"),
          name: request.input("name"),
          email: request.input("email"),
          nip: request.input("nip"),
          password: await Hash.make(request.input("password")),
          job: request.input("job"),
          district: request.input("district"),
          sub_district: request.input("sub_district"),
          gender: request.input("gender"),
          bio: request.input("bio"),
        });

      // Get data created
      let data = await User.query()
        .with("rules")
        .with("userFiles")
        .where("id", request.input("id"))
        .first();

      return response.send(data);
    } catch (error) {
      console.log(error.message);
      return response.status(500).send(error.message);
    }
  }

  async dump({ request, response }) {
    try {
      await User.query().where("id", request.input("id")).update({
        deleted_at: Moment.now(),
      });

      // Get data created
      let data = await User.query()
        .with("rules")
        .with("userFiles")
        .where("id", request.input("id"))
        .first();

      return response.send(data);
    } catch (error) {
      console.log(error.message);
      return response.status(500).send(error.message);
    }
  }

  async restore({ request, response }) {
    try {
      await User.query().where("id", request.input("id")).update({
        deleted_at: null,
      });

      // Get data created
      let data = await User.query()
        .with("rules")
        .with("userFiles")
        .where("id", request.input("id"))
        .first();

      return response.send(data);
    } catch (error) {
      console.log(error.message);
      return response.status(500).send(error.message);
    }
  }
}

module.exports = UserController;
