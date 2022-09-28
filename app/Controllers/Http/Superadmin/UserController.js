"use strict";

const User = use("App/Models/User");
const Moment = require("moment");
const Hash = use("Hash");
const { validate } = use("Validator");
const voca = require("voca");

class UserController {
  async index({ auth, request, response }) {
    try {
      // Validate request
      const rules = {
        page: "required|integer",
        limit: "required|integer",
        order: "required|in:asc,desc",
        search: "string",
        trash: "required|boolean",
      };

      const validation = await validate(request.all(), rules);

      if (validation.fails()) {
        return response.status(422).send(validation.messages()[0]);
      }

      const page = request.input("page");
      const limit = request.input("limit");
      const order = request.input("order");
      const search = request.input("search");
      const user = await auth.getUser();
      const trash = request.input("trash");

      let query = User.query().with("Rule");

      if (search) {
        query
          .where("fullname", "like", `%${search}%`)
          .orWhere("username", "like", `%${search}%`)
          .orWhere("email", "like", `%${search}%`);
      }

      if (trash == "0" || trash == false) {
        query.whereNull("deleted_at");
      }

      if (trash == "1" || trash == true) {
        query.whereNotNull("deleted_at");
      }

      const data = await query
        .with("Rule")
        .with("Rule.Permission")
        .orderBy("id", order)
        .paginate(page, limit);

      return response.send(data);
    } catch (error) {
      console.log(error.message);
      return response.status(500).send(error.message);
    }
  }

  async indexAll({ request, response }) {
    try {
      const data = await User.query()
        .with("Rule")
        .with("Rule.Permission")
        .whereNull("deleted_at")
        .orderBy("fullname", "asc")
        .fetch();

      return response.send(data);
    } catch (error) {
      console.log(error.message);
      return response.status(500).send(error.message);
    }
  }

  async get({ request, response }) {
    try {
      // Validate request
      const rules = {
        id: "required|integer",
      };

      const validation = await validate(request.all(), rules);

      if (validation.fails()) {
        return response.status(422).send(validation.messages()[0]);
      }

      const user_id = request.input("id");

      const data = await User.query()
        .with("Rule")
        .with("Rule.Permission")
        .where("id", user_id)
        .first();

      if (!data) {
        return response.status(404).send({
          message: "User not found",
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
      // Validate request
      const rules = {
        rule_id: "required|integer",
        fullname: "required|string",
        username: "required|min:6|string",
        email: "required|email",
        password: "required|min:8|string",
      };

      const validation = await validate(request.all(), rules);

      if (validation.fails()) {
        return response.status(422).send(validation.messages()[0]);
      }

      const rule_id = request.input("rule_id");
      const fullname = voca.titleCase(request.input("fullname"));
      const username = request.input("username");
      const email = request.input("email");
      const password = request.input("password");

      const findUser = User.query()
        .where("username", username)
        .where("email", email);

      if (await findUser.first()) {
        return response.status(404).send({
          message: "Username or email is exist",
        });
      }

      // Insert to users table
      const insert = await User.create({
        rule_id: rule_id,
        fullname: fullname,
        username: username,
        email: email,
        password: password,
      });

      // Get data created
      const data = await User.query()
        .with("Rule")
        .with("Rule.Permission")
        .where("id", insert.id)
        .first();

      return response.send(data);
    } catch (error) {
      console.log(error.message);
      return response.status(500).send(error.message);
    }
  }

  async edit({ request, response }) {
    try {
      // Validate request
      const rules = {
        user_id: "required|integer",
        rule_id: "required|integer",
        fullname: "required|string",
        username: "required|min:6|string",
        email: "required|email",
      };

      const validation = await validate(request.all(), rules);

      if (validation.fails()) {
        return response.status(422).send(validation.messages()[0]);
      }

      const user_id = request.input("user_id");
      const rule_id = request.input("rule_id");
      const fullname = voca.titleCase(request.input("fullname"));
      const username = request.input("username");
      const email = request.input("email");

      const findUser = await User.query().where("id", user_id).first();

      if (!findUser) {
        return response.status(404).send({
          message: "User not found",
        });
      }

      let payload = {
        rule_id: rule_id,
        fullname: fullname,
        username: username,
        email: email,
      };

      // Insert to users table
      await User.query().where("id", user_id).update(payload);

      // Get data created
      let data = await User.query()
        .with("Rule")
        .with("Rule.Permission")
        .where("id", user_id)
        .first();

      return response.send(data);
    } catch (error) {
      console.log(error.message);
      return response.status(500).send(error.message);
    }
  }

  async editPassword({ request, response }) {
    try {
      // Validate request
      const rules = {
        user_id: "required|integer",
        password: "required|min:8|string",
        confirm_password: "required|same:password|min:8|string",
      };

      const validation = await validate(request.all(), rules);

      if (validation.fails()) {
        return response.status(422).send(validation.messages()[0]);
      }

      const user_id = request.input("user_id");
      const password = request.input("password");
      const confirm_password = request.input("confirm_password");

      const findUser = await User.query().where("id", user_id).first();

      if (!findUser) {
        return response.status(404).send({
          message: "User not found",
        });
      }

      let payload = {
        password: "",
      };

      const hashPassword = await Hash.make(confirm_password);
      payload.password = hashPassword;

      // Insert to users table
      await User.query().where("id", user_id).update(payload);

      // Get data created
      let data = await User.query().where("id", user_id).first();

      return response.send(data);
    } catch (error) {
      console.log(error.message);
      return response.status(500).send(error.message);
    }
  }

  async dump({ request, response }) {
    try {
      // Validate request
      const rules = {
        id: "required|integer",
      };

      const validation = await validate(request.all(), rules);

      if (validation.fails()) {
        return response.status(422).send(validation.messages()[0]);
      }

      const user_id = request.input("id");

      const findUser = await User.query().where("id", user_id).first();

      if (!findUser) {
        return response.status(404).send({
          message: "User not found",
        });
      }

      await User.query().where("id", user_id).update({
        deleted_at: Moment.now(),
      });

      // Get data created
      let data = await User.query().with("Rule").where("id", user_id).first();

      return response.send(data);
    } catch (error) {
      console.log(error.message);
      return response.status(500).send(error.message);
    }
  }

  async restore({ request, response }) {
    try {
      // Validate request
      const rules = {
        id: "required|integer",
      };

      const validation = await validate(request.all(), rules);

      if (validation.fails()) {
        return response.status(422).send(validation.messages()[0]);
      }

      const user_id = request.input("id");

      const findUser = await User.query().where("id", user_id).first();

      if (!findUser) {
        return response.status(404).send({
          message: "User not found",
        });
      }

      await User.query().where("id", user_id).update({
        deleted_at: null,
      });

      // Get data created
      let data = await User.query().with("Rule").where("id", user_id).first();

      return response.send(data);
    } catch (error) {
      console.log(error.message);
      return response.status(500).send(error.message);
    }
  }

  async destroy({ request, response }) {
    try {
      // Validate request
      const rules = {
        id: "required|integer",
      };

      const validation = await validate(request.all(), rules);

      if (validation.fails()) {
        return response.status(422).send(validation.messages()[0]);
      }

      const user_id = request.input("id");

      const findUser = await User.query().where("id", user_id).first();

      if (!findUser) {
        return response.status(404).send({
          message: "User not found",
        });
      }

      await User.query().where("id", user_id).delete();

      return response.send({
        message: "User deleted",
      });
    } catch (error) {
      console.log(error.message);
      return response.status(500).send(error.message);
    }
  }
}

module.exports = UserController;
