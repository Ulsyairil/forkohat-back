"use strict";

const User = use("App/Models/User");
const Hash = use("Hash");

class ProfileController {
  async changePassword({ auth, request, response }) {
    try {
      // Validate request
      const rules = {
        password: "string",
        confirmation_password: "same:password|required|string",
      };

      const validation = await validate(request.all(), rules);

      if (validation.fails()) {
        return response.status(422).send(validation.messages()[0]);
      }

      const confirmation_password = request.input("confirmation_password");
      const hashPassword = await Hash.make(confirmation_password);
      const user = await auth.getUser();

      await User.query().where("id", user.id).update({
        password: hashPassword,
      });

      return response.status(422).send({
        message: "success update password",
      });
    } catch (error) {
      console.log(error.message);
      return response.status(500).send(error.message);
    }
  }
}

module.exports = ProfileController;
