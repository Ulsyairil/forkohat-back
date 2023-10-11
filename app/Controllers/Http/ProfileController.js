'use strict'

const User = use('App/Models/User')
const Hash = use('Hash')
const { validate } = use('Validator')

class ProfileController {
  async changePassword({ auth, request, response }) {
    try {
      // Validate request
      const rules = {
        new_password: 'required|string',
        confirmation_new_password: 'required|string',
      }

      const validation = await validate(request.all(), rules)

      if (validation.fails()) {
        return response.status(422).send(validation.messages()[0])
      }

      const newPassword = request.input('new_password')
      const confirmationNewPassword = request.input('confirmation_new_password')

      if (confirmationNewPassword != newPassword) {
        return response.status(422).send({
          message: 'Kata Sandi Tidak Sama',
        })
      }

      const hashPassword = await Hash.make(confirmationNewPassword)
      const user = await auth.getUser()

      await User.query().where('id', user.id).update({
        password: hashPassword,
      })

      return response.status(422).send({
        message: 'Kata Sandi Berhasil Diubah',
      })
    } catch (error) {
      console.log(error.message)
      return response.status(500).send(error.message)
    }
  }
}

module.exports = ProfileController
