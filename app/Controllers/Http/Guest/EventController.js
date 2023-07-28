'use strict'

const Event = use('App/Models/Event')
const Arrangement = use('App/Models/Arrangement')
const { validate } = use('Validator')

class EventController {
  async index({ request, response }) {
    try {
      const rules = {
        arrangement_id: 'required|integer',
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
      const arrangement_id = request.input('arrangement_id')

      // Find arrangement
      let findArrangement = await Arrangement.find(arrangement_id)

      // Check arrangement if exist
      if (!findArrangement) {
        return response.status(404).send({
          message: 'Tatanan Tidak Ditemukan',
        })
      }

      // Get data
      let query = Event.query()
        .with('Author')
        .with('Arrangement')
        .with('Arrangement.Program')
        .where('arrangement_id', arrangement_id)

      if (search) {
        query
          .where('title', 'like', `%${search}%`)
          .orWhere('description', 'like', `%${search}%`)
      }

      let data = await query
        .where('showed', 'public')
        .whereNull('deleted_at')
        .orderBy('id', order)
        .paginate(page, limit)

      return response.send(data)
    } catch (error) {
      console.log(error.message)
      return response.status(500).send(error.message)
    }
  }

  async indexPublic({ request, response }) {
    try {
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

      // Get data
      let query = Event.query()
        .with('Author')
        .with('Arrangement')
        .with('Arrangement.Program')

      if (search) {
        query
          .where('title', 'like', `%${search}%`)
          .orWhere('description', 'like', `%${search}%`)
      }

      let data = await query
        .where('showed', 'public')
        .whereNull('deleted_at')
        .orderBy('id', order)
        .paginate(page, limit)

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

      const event_id = request.input('id')

      // Get data
      let data = await Event.query()
        .with('Author')
        .with('EventFiles')
        .with('Arrangement')
        .with('Arrangement.Program')
        .where('id', event_id)
        .first()

      if (!data) {
        return response.status(400).send({
          message: 'Kegiatan Tidak Ditemukan',
        })
      }

      return response.send(data)
    } catch (error) {
      console.log(error.message)
      return response.status(500).send(error.message)
    }
  }
}

module.exports = EventController
