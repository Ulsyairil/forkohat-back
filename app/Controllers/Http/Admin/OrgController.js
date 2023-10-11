'use strict'

const Org = use('App/Models/Org')
const voca = require('voca')
const { validate } = use('Validator')

class OrgController {
  async index({ request, response }) {
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
      let query = Org.query().with('User')

      if (search) {
        query
          .whereHas('User', builder => {
            builder.where('fullname', 'like', `%${search}%`)
          })
          .orWhere('area', 'like', `%${search}%`)
          .orWhere('office', 'like', `%${search}%`)
          .orWhere('positionName', 'like', `%${search}%`)
      }

      let data = await query.orderBy('id', order).paginate(page, limit)

      return response.send(data)
    } catch (error) {
      console.log(error.message)
      return response.status(500).send(error.message)
    }
  }

  async indexAll({ request, response }) {
    try {
      let data = await Org.query().with('User').orderBy('id', 'asc').fetch()

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

  async create({ auth, request, response }) {
    try {
      const rules = {
        user_id: 'required|integer',
        parent_id: 'integer',
        area: 'string',
        office: 'string',
        position_name: 'required|string',
      }

      const validation = await validate(request.all(), rules)

      if (validation.fails()) {
        return response.status(422).send(validation.messages()[0])
      }

      const userId = request.input('user_id')
      const parentId = request.input('parent_id')
      const area = voca.upperCase(request.input('area'))
      const office = voca.upperCase(request.input('office'))
      const positionName = voca.upperCase(request.input('position_name'))

      // Store data
      let store = await Org.create({
        userId: userId,
        parentId: parentId,
        area: area,
        office: office,
        positionName: positionName,
      })

      // Get data stored
      let data = await Org.query().with('User').where('id', store.id).first()

      return response.send(data)
    } catch (error) {
      console.log(error.message)
      return response.status(500).send(error.message)
    }
  }

  async edit({ request, response }) {
    try {
      const rules = {
        id: 'required|integer',
        user_id: 'required|integer',
        parent_id: 'integer',
        area: 'string',
        office: 'string',
        position_name: 'required|string',
      }

      const validation = await validate(request.all(), rules)

      if (validation.fails()) {
        return response.status(422).send(validation.messages()[0])
      }

      const id = request.input('id')
      const userId = request.input('user_id')
      const parentId = request.input('parent_id')
      const area = voca.upperCase(request.input('area'))
      const office = voca.upperCase(request.input('office'))
      const positionName = voca.upperCase(request.input('position_name'))

      // Find data
      const findData = await Org.find(id)

      if (!findData) {
        return response.status(404).send({
          message: 'Data Tidak Ditemukan',
        })
      }

      // Update data
      await Org.query().where('id', id).update({
        userId: userId,
        parentId: parentId,
        area: area,
        office: office,
        positionName: positionName,
      })

      // Get data created
      let data = await Org.query().with('User').where('id', id).first()

      return response.send(data)
    } catch (error) {
      console.log(error.message)
      return response.status(500).send(error.message)
    }
  }

  async destroy({ request, response }) {
    try {
      const rules = {
        id: 'required|integer',
      }

      const validation = await validate(request.all(), rules)

      if (validation.fails()) {
        return response.status(422).send(validation.messages()[0])
      }

      const id = request.input('id')

      // Find data
      const findData = await Org.find(id)

      if (!findData) {
        return response.status(404).send({
          message: 'Data Tidak Ditemukan',
        })
      }

      await Org.query().where('id', id).delete()

      return response.send({
        message: 'Data deleted',
      })
    } catch (error) {
      console.log(error.message)
      return response.status(500).send(error.message)
    }
  }
}

module.exports = OrgController
