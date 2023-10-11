'use strict'

const FAQ = use('App/Models/Faq')
const { validate } = use('Validator')

class FaqTopicController {
  async index({ request, response }) {
    try {
      // Validate request
      const rules = {
        page: 'required|integer',
        limit: 'required|integer',
        order: 'required|in:asc,desc',
        search: 'string',
      }

      const validation = await validate(request.all(), rules)

      if (validation.fails()) {
        return response.status(422).send(validation.messages()[0])
      }

      const page = request.input('page')
      const limit = request.input('limit')
      const order = request.input('order')
      const search = request.input('search')

      let query = FAQ.query()

      if (search) {
        query
          .where('title', 'like', `%${search}%`)
          .orWhere('description', 'like', `%${search}%`)
      }

      const data = await query.orderBy('id', order).paginate(page, limit)

      return response.send(data)
    } catch (error) {
      console.log(error.message)
      return response.status(500).send(error.message)
    }
  }

  async get({ request, response }) {
    try {
      // Validate request
      const rules = {
        id: 'required|integer',
      }

      const validation = await validate(request.all(), rules)

      if (validation.fails()) {
        return response.status(422).send(validation.messages()[0])
      }

      const fadId = request.input('id')

      let data = await FAQ.find(fadId)

      if (!data) {
        return response.status(404).send({
          message: 'FAQ Tidak Ditemukan',
        })
      }

      return response.send(data)
    } catch (error) {
      console.log(error.message)
      return response.status(500).send(error.message)
    }
  }

  async create({ request, response }) {
    try {
      // Validate request
      const rules = {
        title: 'required|string',
        description: 'required|string',
      }

      const validation = await validate(request.all(), rules)

      if (validation.fails()) {
        return response.status(422).send(validation.messages()[0])
      }

      const title = request.input('title')
      const description = request.input('description')

      let create = await FAQ.create({
        title: title,
        description: description,
      })

      return response.send(create)
    } catch (error) {
      console.log(error.message)
      return response.status(500).send(error.message)
    }
  }

  async edit({ request, response }) {
    try {
      // Validate request
      const rules = {
        id: 'required|integer',
        title: 'required|string',
        description: 'string',
      }

      const validation = await validate(request.all(), rules)

      if (validation.fails()) {
        return response.status(422).send(validation.messages()[0])
      }

      const faqId = request.input('id')
      const title = request.input('title')
      const description = request.input('description')

      let findFaq = await FAQ.find(faqId)

      if (!findFaq) {
        return response.status(404).send({
          message: 'FAQ Tidak Ditemukan',
        })
      }

      await FAQ.query().where('id', faqId).update({
        title: title,
        description: description,
      })

      let data = await FAQ.find(faqId)

      return response.send(data)
    } catch (error) {
      console.log(error.message)
      return response.status(500).send(error.message)
    }
  }

  async destroy({ request, response }) {
    try {
      // Validate request
      const rules = {
        id: 'required|integer',
      }

      const validation = await validate(request.all(), rules)

      if (validation.fails()) {
        return response.status(422).send(validation.messages()[0])
      }

      const faqId = request.input('id')

      await FAQ.query().where('id', faqId).delete()

      return response.send({
        message: 'FAQ berhasil dihapus',
      })
    } catch (error) {
      console.log(error.message)
      return response.status(500).send(error.message)
    }
  }
}

module.exports = FaqTopicController
