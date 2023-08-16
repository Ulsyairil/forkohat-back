'use strict'

const Faq = use('App/Models/Faq')

class FaqController {
  async index({ request, response }) {
    try {
      let data = await Faq.query().orderBy('id', 'asc').fetch()

      return response.send(data)
    } catch (error) {
      console.log(error.message)
      return response.status(500).send(error.message)
    }
  }
}

module.exports = FaqController
