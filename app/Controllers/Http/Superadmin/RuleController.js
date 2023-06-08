'use strict'

const Rule = use('App/Models/Rule')
const { validate } = use('Validator')

class RuleController {
  async index({ auth, request, response }) {
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

      let query = Rule.query()

      if (search) {
        query.where('name', 'like', `%${search}%`)
      }

      const data = await query
        .whereNot('id', 1)
        .whereNot('id', 2)
        .whereNot('id', 3)
        .orderBy('id', order)
        .paginate(page, limit)

      return response.send(data)
    } catch (error) {
      console.log(error.message)
      return response.status(500).send(error.message)
    }
  }

  async indexAll({ auth, request, response }) {
    try {
      let data = await Rule.query().orderBy('name', 'asc').fetch()
      console.log(data)

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

      const rule_id = request.input('id')

      let data = await Rule.query()
        .with('Permission', permissionQuery => {
          permissionQuery.with('Program')
          permissionQuery.with('Arrangement')
        })
        .where('id', rule_id)
        .first()

      if (!data) {
        return response.status(404).send({
          message: 'Rule Tidak Ditemukan',
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
        rule: 'required|string',
        is_superadmin: 'boolean',
        is_admin: 'boolean',
        is_member: 'boolean',
        is_guest: 'boolean',
      }

      const validation = await validate(request.all(), rules)

      if (validation.fails()) {
        return response.status(422).send(validation.messages()[0])
      }

      const rule = request.input('rule')
      const is_superadmin = request.input('is_superadmin')
      const is_admin = request.input('is_admin')
      const is_member = request.input('is_member')
      const is_guest = request.input('is_guest')

      const create = await Rule.create({
        name: rule,
        is_superadmin: is_superadmin,
        is_admin: is_admin,
        is_member: is_member,
        is_guest: is_guest,
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
        rule: 'required|string',
        is_superadmin: 'boolean',
        is_admin: 'boolean',
        is_member: 'boolean',
        is_guest: 'boolean',
      }

      const validation = await validate(request.all(), rules)

      if (validation.fails()) {
        return response.status(422).send(validation.messages()[0])
      }

      const rule_id = request.input('id')
      const rule = request.input('rule')
      const is_superadmin = request.input('is_superadmin')
      const is_admin = request.input('is_admin')
      const is_member = request.input('is_member')
      const is_guest = request.input('is_guest')

      const findRule = await Rule.find(rule_id)

      if (!findRule) {
        return response.status(404).send({
          message: 'Rule Tidak Ditemukan',
        })
      }

      await Rule.query().where('id', rule_id).update({
        name: rule,
        is_superadmin: is_superadmin,
        is_admin: is_admin,
        is_member: is_member,
        is_guest: is_guest,
      })

      let data = await Rule.find(rule_id)

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

      const rule_id = request.input('id')

      const findRule = await Rule.find(rule_id)

      if (!findRule) {
        return response.status(404).send({
          message: 'Rule Tidak Ditemukan',
        })
      }

      await Rule.query().where('id', rule_id).delete()

      return response.send({
        message: 'Rule deleted',
      })
    } catch (error) {
      console.log(error.message)
      return response.status(500).send(error.message)
    }
  }
}

module.exports = RuleController
