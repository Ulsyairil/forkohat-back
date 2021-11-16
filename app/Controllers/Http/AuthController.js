"use strict";

const { validateAll } = use("Validator");
const Hash = use("Hash");
const User = use("App/Models/User");

class AuthController {
  async login({ auth, request, response }) {
    try {
      const rules = {
        select: "required|in:username,email",
        username: "required_when:select,username|string",
        email: "required_when:select,email|email",
        password: "required|string",
      };

      const validation = await validateAll(request.all(), rules);

      if (validation.fails()) {
        return response.status(422).send(validation.messages());
      }

      let check;

      if (request.input("select") == "email") {
        check = await User.query()
          .with("Rule")
          .with("Rule.RuleItem")
          .where("email", request.input("email"))
          .whereNull("deleted_at")
          .first();
      }

      if (request.input("select") == "username") {
        check = await User.query()
          .with("Rule")
          .with("Rule.RuleItem")
          .where("username", request.input("username"))
          .whereNull("deleted_at")
          .first();
      }

      if (check == null) {
        let message;

        if (request.input("select") == "email") {
          message = "Email not exists";
        }

        if (request.input("select") == "username") {
          message = "Username not exists";
        }

        return response.status(401).send({
          message: message,
        });
      }

      const isSame = await Hash.verify(
        request.input("password"),
        check.password
      );

      console.log(check.password);

      if (!isSame) {
        return response.status(401).send({
          message: "wrong password",
        });
      }

      let generate = await auth.generate(check);

      return response.send({
        token: generate,
        data: check,
      });
    } catch (error) {
      console.log(error.message);
      return response.status(500).send(error.message);
    }
  }

  async register({ request, response }) {
    try {
      const rules = {
        fullname: "required|string",
        username: "required|string",
        password: "required|string",
      };

      const validation = await validateAll(request.all(), rules);

      if (validation.fails()) {
        return response.status(422).send(validation.messages());
      }

      const fullname = request.input("fullname");
      const username = request.input("username");
      const password = request.input("password");

      const findUser = await User.query().where("username", username).first();

      if (findUser) {
        return response.status(400).send({
          message: "user still exist",
        });
      }

      const createUser = await User.create({
        rule_id: 2,
        fullname: fullname,
        username: username,
        password: password,
      });

      return response.status(200).send(createUser);
    } catch (error) {
      console.log(error.message);
      return response.status(500).send(error.message);
    }
  }

  async checkUser({ auth, request, response }) {
    try {
      let check = await auth.check();

      if (!check) {
        return response.status(401).send({
          message: "Unauthorized",
        });
      }

      const userLogged = await auth.getUser();
      let data = await User.query()
        .with("Rule")
        .where("id", userLogged.id)
        .whereNull("deleted_at")
        .first();

      return response.send({
        data: data,
      });
    } catch (error) {
      console.log(error.message);
      return response.status(500).send(error.message);
    }
  }

  async logout({ auth, request, response }) {
    try {
      const rules = {
        token: "required|string",
      };

      const validation = await validateAll(request.all(), rules);

      if (validation.fails()) {
        return response.status(422).send(validation.messages());
      }

      await auth
        .authenticator("api")
        .revokeTokens([request.input("token")], true);

      return response.send({
        message: "logout success",
      });
    } catch (error) {
      console.log(error.message);
      return response.status(500).send(error.message);
    }
  }
}

module.exports = AuthController;
