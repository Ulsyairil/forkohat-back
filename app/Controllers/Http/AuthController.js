'use strict';

const { validateAll } = use('Validator');
const Hash = use('Hash');
const User = use('App/Models/User');

class AuthController {
  async login({ auth, request, response }) {
    try {
      const rules = {
        select: 'required|in:nip,email',
        email: 'required_when:select,email|email',
        nip: 'required_when:select,nip|string',
        password: 'required|string',
      };

      const validation = await validateAll(request.all(), rules);

      if (validation.fails()) {
        return response.status(422).send(validation.messages());
      }

      let check;

      if (request.input('select') == 'email') {
        check = await User.query()
          .with('rules')
          .where('email', request.input('email'))
          .whereNull('deleted_at')
          .first();
      }

      if (request.input('select') == 'nip') {
        check = await User.query()
          .with('rules')
          .where('nip', request.input('nip'))
          .whereNull('deleted_at')
          .first();
      }

      if (check == null) {
        let message;

        if (request.input('select') == 'email') {
          message = 'email not exists';
        }

        if (request.input('select') == 'nip') {
          message = 'nip not exists';
        }

        return response.status(401).send({
          message: message,
        });
      }

      const isSame = await Hash.verify(
        request.input('password'),
        check.password
      );

      console.log(check.password);

      if (!isSame) {
        return response.status(401).send({
          message: 'wrong password',
        });
      }

      let generate = await auth.withRefreshToken().generate(check);

      return response.send({
        token: generate,
        data: check,
      });
    } catch (error) {
      console.log(error);
      return response.status(500).send(error);
    }
  }

  async checkUser({ auth, request, response }) {
    try {
      const rules = {
        refresh: 'required|boolean',
        refresh_token: 'required|string',
      };

      const validation = await validateAll(request.all(), rules);

      if (validation.fails()) {
        return response.status(422).send(validation.messages());
      }

      let check = await auth.check();

      if (!check) {
        return response.status(401).send({
          message: 'Unauthorized',
        });
      }

      let auth_user = await auth.getUser();
      let data = await User.query()
        .with('rules')
        .where('id', auth_user.id)
        .whereNull('deleted_at')
        .first();

      let refresh_token = null;

      if (request.input('refresh') == true) {
        refresh_token = await auth.generateForRefreshToken(
          request.input('refresh_token'),
          true
        );
      }

      return response.send({
        token: refresh_token,
        data: data,
      });
    } catch (error) {
      console.log(error);
      return response.status(500).send(error);
    }
  }

  async logout({ auth, request, response }) {
    try {
      const rules = {
        refresh_token: 'required|string',
      };

      const validation = await validateAll(request.all(), rules);

      if (validation.fails()) {
        return response.status(422).send(validation.messages());
      }

      await auth
        .authenticator('jwt')
        .revokeTokens([request.input('refresh_token')], true);

      return response.send({
        message: 'logout success',
      });
    } catch (error) {
      console.log(error);
      return response.status(500).send(error);
    }
  }
}

module.exports = AuthController;
