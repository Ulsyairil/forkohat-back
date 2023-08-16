'use strict'

const Org = use('App/Models/Org')
const voca = require('voca')
const { validate } = use('Validator')

class OrgController {
  async index({ request, response }) {
    try {
      let data = await Org.query().with('User').orderBy('id', 'asc')

      return response.send(data)
    } catch (error) {
      console.log(error.message)
      return response.status(500).send(error.message)
    }
  }

  async get({ request, response }) {
    try {
      const rules = {
        id: 'required|integer',
      }

      const validation = await validate(request.all(), rules)

      if (validation.fails()) {
        return response.status(422).send(validation.messages()[0])
      }

      const user_id = request.input('id')

      let data = await Org.query().with('User').where('id', user_id).first()

      if (!data) {
        return response.status(404).send({
          message: 'Data Tidak Ditemukan',
        })
      }

      return response.send(data)
    } catch (error) {
      console.log(error.message)
      return response.status(500).send(error.message)
    }
  }
}

module.exports = OrgController
