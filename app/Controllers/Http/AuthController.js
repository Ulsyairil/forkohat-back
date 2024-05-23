'use strict'

const { validateAll } = use('Validator')
const Hash = use('Hash')
const User = use('App/Models/User')
const Voca = require('voca')

class AuthController {
  async login({ auth, request, response }) {
    try {
      const rules = {
        select: 'required|in:username,email',
        username: 'required_when:select,username|min:6|string',
        email: 'required_when:select,email|email',
        password: 'required|min:8|string',
      }

      const messages = {
        'select.required': 'Pilih penggunaan akun harus diisi',
        'select.in': 'Pilih penggunaan akun harus username atau email',
        'username.required_when': 'Username harus diisi',
        'username.min': 'Username minimal harus 6 karakter',
        'email.required_when': 'Email harus diisi',
        'email.email': 'Email tidak valid',
        'password.required': 'Kata sandi harus diisi',
        'password.min': 'Kata sandi minimal harus 8 karakter',
      }

      const validation = await validateAll(request.all(), rules, messages)

      if (validation.fails()) {
        return response.status(422).send(validation.messages())
      }

      let user

      if (request.input('select') == 'email') {
        user = await User.query()
          .with('Rule')
          .with('Rule.Permission')
          .where('email', request.input('email'))
          .whereNull('deleted_at')
          .first()
      }

      if (request.input('select') == 'username') {
        user = await User.query()
          .with('Rule')
          .with('Rule.Permission')
          .where('username', request.input('username'))
          .whereNull('deleted_at')
          .first()
      }

      if (user == null) {
        let message

        if (request.input('select') == 'email') {
          message = 'Email tidak ditemukan'
        }

        if (request.input('select') == 'username') {
          message = 'Username tidak ditemukan'
        }

        return response.status(404).send({
          message: message,
        })
      }

      const checkPassword = await Hash.verify(
        request.input('password'),
        user.password
      )

      if (!checkPassword) {
        return response.status(401).send({
          message: 'Kata Sandi Salah',
        })
      }

      let generate = await auth.withRefreshToken().generate(user)

      return response.status(200).send(generate)
    } catch (error) {
      console.log(error.message)
      return response.status(500).send(error.message)
    }
  }

  async register({ request, auth, response }) {
    try {
      const rules = {
        fullname: 'required|string',
        username: 'required|string|min:6',
        email: 'required|email',
        password: 'required|string|min:8',
      }

      const messages = {
        'fullname.required': 'Nama lengkap harus diisi',
        'username.required': 'Username harus diisi',
        'username.min': 'Username minimal harus 6 karakter',
        'email.required': 'Email harus diisi',
        'email.email': 'Email tidak valid',
        'password.required': 'Kata sandi harus diisi',
        'password.min': 'Kata sandi minimal harus 8 karakter',
      }

      const validation = await validateAll(request.all(), rules, messages)

      if (validation.fails()) {
        return response.status(422).send(validation.messages())
      }

      const fullname = Voca.titleCase(request.input('fullname'))
      const username = request.input('username')
      const email = request.input('email')
      const password = request.input('password')

      const findUser = await User.query()
        .where('username', username)
        .orWhere('email', email)
        .first()

      if (findUser) {
        return response.status(400).send({
          message: 'Username atau email Telah Digunakan',
        })
      }

      await User.create({
        rule_id: 3,
        fullname: fullname,
        email: email,
        username: username,
        password: password,
      })

      const getUser = await User.query()
        .with('Rule')
        .with('Rule.Permission')
        .where('fullname', fullname)
        .where('username', username)
        .first()

      const generate = await auth.withRefreshToken().generate(getUser)

      return response.status(200).send(generate)
    } catch (error) {
      console.log(error.message)
      return response.status(500).send(error.message)
    }
  }

  async checkUser({ auth, request, response }) {
    try {
      let check = await auth.check()

      if (!check) {
        return response.status(401).send({
          message: 'Unauthorized',
        })
      }

      const userLogged = await auth.getUser()
      const data = await User.query()
        .with('Rule')
        .with('Rule.Permission')
        .where('id', userLogged.id)
        .whereNull('deleted_at')
        .first()

      return response.status(200).send(data)
    } catch (error) {
      console.log(error.message)
      return response.status(500).send(error.message)
    }
  }

  async refreshToken({ auth, request, response }) {
    try {
      let check = await auth.check()

      if (!check) {
        return response.status(401).send({
          message: 'Unauthorized',
        })
      }

      const refreshToken = request.input('refresh_token')
      const generate = await auth.generateForRefreshToken(refreshToken)

      return response.status(200).send(generate)
    } catch (error) {
      console.log(error.message)
      return response.status(500).send(error.message)
    }
  }

  async logout({ auth, request, response }) {
    try {
      const header = request.header('authorization')
      header.substring(7, header.length)

      const isRevoked = await auth
        .authenticator('jwt')
        .revokeTokens([request.input('token')], true)

      if (!isRevoked) {
        return response.status(401).send({
          message: 'Unauthorized',
        })
      }

      return response.status(200).send({
        message: 'Logout success',
      })
    } catch (error) {
      console.log(error.message)
      return response.status(500).send(error.message)
    }
  }
}

module.exports = AuthController
