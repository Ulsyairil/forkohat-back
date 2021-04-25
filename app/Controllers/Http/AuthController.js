"use strict";

const { validate } = use("Validator");
const Hash = use("Hash");
const User = use("App/Models/User");

class AuthController {
  async login({ auth, request, response }) {
    try {
      const rules = {
        select: "required|in:nip,email",
        email: "required_when:select,email|email",
        nip: "required_when:select,nip|string",
        password: "required|string",
      };

      const validation = await validate(request.all(), rules);

      if (validation.fails()) {
        return response.status(422).send(validation.messages());
      }

      let check;

      if (request.input("select") == "email") {
        check = await User.query()
          .where("email", request.input("email"))
          .first();
      }

      if (request.input("select") == "nip") {
        check = await User.where("nip", request.input("nip")).first();
      }

      if (check == null) {
        let message;

        if (request.input("select") == "email") {
          message = "email not exists";
        }

        if (request.input("select") == "nip") {
          message = "nip not exists";
        }

        return response.status(401).send({
          message: message,
        });
      }

      const isSame = await Hash.verify(
        request.input("password"),
        check.password
      );

      if (!isSame) {
        return response.status(401).send({
          message: "wrong password",
        });
      }

      let generate = await auth.withRefreshToken().generate(check);

      return response.send(generate);
    } catch (error) {
      console.log(error);
      return response.status(500).send(error);
    }
  }

  async checkUser({ auth, request, response }) {
    try {
      let get_user = await auth.getUser();
      return response.send(get_user);
    } catch (error) {
      console.log(error);
      return response.status(500).send(error);
    }
  }

  async refreshToken({ auth, request, response }) {
    try {
      const rules = {
        refresh_token: "required|string",
      };

      const validation = await validate(request.all(), rules);

      if (validation.fails()) {
        return response.status(422).send(validation.messages());
      }

      const refresh_token = await auth.generateForRefreshToken(
        request.input("refresh_token"),
        true
      );

      return response.send(refresh_token);
    } catch (error) {
      console.log(error);
      return response.status(500).send(error);
    }
  }

  async logout({ auth, request, response }) {
    try {
      const rules = {
        refresh_token: "required|string",
      };

      const validation = await validate(request.all(), rules);

      if (validation.fails()) {
        return response.status(422).send(validation.messages());
      }

      await auth
        .authenticator("jwt")
        .revokeTokens([request.input("refresh_token")], true);

      return response.send({
        message: "logout success",
      });
    } catch (error) {
      console.log(error);
      return response.status(500).send(error);
    }
  }
}

module.exports = AuthController;
