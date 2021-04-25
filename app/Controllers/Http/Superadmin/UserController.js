"use strict";

const Helpers = use("Helpers");
const fs = use("fs");
const path = use("path");
const removeFile = Helpers.promisify(fs.unlink);
const User = use("App/Models/User");
const UserFile = use("App/Models/UserFile");
const RandomString = use("randomstring");
const Moment = use("moment");
const Hash = use("Hash");
const { validateAll } = use("Validator");

class UserController {
  async index({ request, response }) {
    try {
      let queryTotalData = await User.query()
        .with("rules")
        .whereNot("rule_id", "1")
        .count("* as total");

      let totalData = queryTotalData[0].total;
      console.log(totalData);

      let queryTotalFilteredData = User.query()
        .with("rules")
        .whereNot("rule_id", "1");

      if (request.input("search").value != "") {
        queryTotalFilteredData
          .with("rules", (builder) => {
            builder.where("rule", "like", `%${request.input("search").value}%`);
          })
          .where("name", "like", `%${request.input("search").value}%`)
          .orWhere("email", "like", `%${request.input("search").value}%`)
          .orWhere("nip", "like", `%${request.input("search").value}%`)
          .orWhere("job", "like", `%${request.input("search").value}%`)
          .orWhere("gender", "like", `%${request.input("search").value}%`)
          .orWhere("created_at", "like", `%${request.input("search").value}%`)
          .orWhere("updated_at", "like", `%${request.input("search").value}%`)
          .orWhere("deleted_at", "like", `%${request.input("search").value}%`);
      }

      let count = await queryTotalFilteredData.count("* as total");
      let totalFiltered = count[0].total;

      let getData = User.query().with("rules").whereNot("rule_id", "1");

      if (request.input("search").value != "") {
        getData
          .with("rules", (builder) => {
            builder.where("rule", "like", `%${request.input("search").value}%`);
          })
          .where("name", "like", `%${request.input("search").value}%`)
          .orWhere("email", "like", `%${request.input("search").value}%`)
          .orWhere("nip", "like", `%${request.input("search").value}%`)
          .orWhere("job", "like", `%${request.input("search").value}%`)
          .orWhere("gender", "like", `%${request.input("search").value}%`)
          .orWhere("created_at", "like", `%${request.input("search").value}%`)
          .orWhere("updated_at", "like", `%${request.input("search").value}%`)
          .orWhere("deleted_at", "like", `%${request.input("search").value}%`);
      }

      request.input("order").forEach((value) => {
        getData.orderBy(value.column, value.dir);
      });

      getData.offset(request.input("start")).limit(request.input("length"));

      let data = await getData.fetch();
      console.log(data);

      return response.send({
        draw: Number(request.input("draw")),
        recordsTotal: totalData,
        recordsFiltered: totalFiltered,
        data: data,
      });
    } catch (error) {
      console.log(error);
      return response.status(500).send(error);
    }
  }

  async get({ request, response }) {
    try {
      const rules = {
        id: "required|number",
      };

      const validation = await validateAll(request.all(), rules);

      if (validation.fails()) {
        return response.status(422).send(validation.messages());
      }

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
      console.log(error);
      return response.status(500).send(error);
    }
  }

  async create({ request, response }) {
    try {
      let fileName;

      // Upload image
      let inputImage = request.file("image", {
        size: "2mb",
        extnames: ["png", "jpg", "jpeg"],
      });

      if (inputImage) {
        fileName = `${RandomString.generate()}.${inputImage.subtype}`;

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
        password: await Hash.make(request.input("password")),
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
          mime: inputImage.subtype,
          path: Helpers.resourcesPath("uploads/users"),
          url: "/",
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
      console.log(error);
      return response.status(500).send(error);
    }
  }

  async edit({ request, response }) {
    try {
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

        let fileName = `${RandomString.generate()}.${inputImage.subtype}`;

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
          mime: inputImage.subtype,
          path: Helpers.resourcesPath("uploads/users"),
          url: "/",
        });
      }

      // Insert to users table
      await User.query()
        .where("id", request.input("id"))
        .update({
          rule_id: request.input("rule_id"),
          name: request.input("email"),
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
      console.log(error);
      return response.status(500).send(error);
    }
  }

  async dump({ request, response }) {
    try {
      const rules = {
        id: "required|number",
      };

      const validation = await validateAll(request.all(), rules);

      if (validation.fails()) {
        return response.status(422).send(validation.messages());
      }

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
      console.log(error);
      return response.status(500).send(error);
    }
  }

  async restore({ request, response }) {
    try {
      const rules = {
        id: "required|number",
      };

      const validation = await validateAll(request.all(), rules);

      if (validation.fails()) {
        return response.status(422).send(validation.messages());
      }

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
      console.log(error);
      return response.status(500).send(error);
    }
  }
}

module.exports = UserController;
