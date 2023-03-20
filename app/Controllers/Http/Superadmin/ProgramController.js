'use strict'

const Helpers = use('Helpers')
const fs = use('fs')
const path = use('path')
const removeFile = Helpers.promisify(fs.unlink)
const Program = use('App/Models/Program')
const RandomString = require('randomstring')
const Moment = require('moment')
const voca = require('voca')
const { validate } = use('Validator')

class ProgramController {
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

      // All input
      const page = request.input('page')
      const limit = request.input('limit')
      const order = request.input('order')
      const search = request.input('search')

      // Initiate program query
      let query = Program.query()

      // Search program query
      if (search) {
        query
          .where('title', 'like', `%${search}%`)
          .orWhere('description', 'like', `%${search}%`)
          .orWhere('created_at', 'like', `%${search}%`)
          .orWhere('updated_at', 'like', `%${search}%`)
      }

      // Find program
      let data = await query
        .whereNot('id', 1)
        .orderBy('id', order)
        .paginate(page, limit)

      console.log(data)

      return response.send(data)
    } catch (error) {
      console.log(error.message)
      return response.status(500).send(error.message)
    }
  }

  async indexAll({ request, response }) {
    try {
      // Find program
      const data = await Program.query()
        .whereNot('id', 1)
        .orderBy('title', 'asc')
        .fetch()

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

      // All input
      const program_id = request.input('id')

      // Find program
      let data = await Program.query().where('id', program_id).first()

      // Return false if program not exists
      if (!data) {
        return response.status(404).send({
          message: 'Program not found',
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

      // All input
      const title = request.input('title')
      const description = request.input('description')
      const inputImage = request.file('image', {
        extnames: ['png', 'jpg', 'jpeg'],
      })

      // Check input image is null
      if (inputImage == null) {
        return response.status(422).send({
          message: 'Program Image must be uploaded',
        })
      }

      // Moving uploaded file
      let fileName
      let random = RandomString.generate({
        capitalization: 'lowercase',
      })

      fileName = `${voca.snakeCase(
        inputImage.clientName.split('.').slice(0, -1).join('.')
      )}_${random}.${inputImage.extname}`

      await inputImage.move(Helpers.resourcesPath('uploads/program'), {
        name: fileName,
      })

      if (!inputImage.moved()) {
        return response.status(422).send(inputImage.error())
      }

      // Insert to program table
      let program = await Program.create({
        title: title,
        description: description,
        image_name: fileName,
        image_mime: inputImage.extname,
        image_path: Helpers.resourcesPath('uploads/program'),
        image_url: `/api/v1/file/${inputImage.extname}/${fileName}`,
      })

      // Get data created
      let data = await Program.query().where('id', program.id).first()

      return response.send(data)
    } catch (error) {
      console.log(error.message)
      return response.status(500).send(error.message)
    }
  }

  async edit({ request, response }) {
    try {
      // Validate request
      const rules = {
        program_id: 'required|integer',
        title: 'required|string',
        description: 'required|string',
      }

      const validation = await validate(request.all(), rules)

      if (validation.fails()) {
        return response.status(422).send(validation.messages()[0])
      }

      // All input
      const program_id = request.input('program_id')
      const title = request.input('title')
      const description = request.input('description')
      const inputImage = request.file('image', {
        extnames: ['png', 'jpg', 'jpeg'],
      })

      // Find program
      let findData = await Program.find(program_id)

      // Return false if program not exists
      if (!findData) {
        return response.status(404).send({
          message: 'Program not found',
        })
      }

      let fileName
      let random = RandomString.generate({
        capitalization: 'lowercase',
      })

      // Upload image
      if (inputImage) {
        let findImage = await Program.query().where('id', program_id).first()

        // Delete image
        if (findImage) {
          removeFile(
            path.join(
              Helpers.resourcesPath('uploads/program'),
              findImage.image_name
            )
          )
        }

        fileName = `${voca.snakeCase(
          inputImage.clientName.split('.').slice(0, -1).join('.')
        )}_${random}.${inputImage.extname}`

        await inputImage.move(Helpers.resourcesPath('uploads/program'), {
          name: fileName,
        })

        if (!inputImage.moved()) {
          return response.status(422).send(inputImage.error())
        }
      }

      // Update program
      let query = Program.query().where('id', program_id)

      if (inputImage) {
        await query.update({
          title: title,
          description: description,
          image_name: fileName,
          image_mime: inputImage.extname,
          image_path: Helpers.resourcesPath('uploads/program'),
          image_url: `/api/v1/file/${inputImage.extname}/${fileName}`,
        })
      } else {
        await query.update({
          title: title,
          description: description,
        })
      }

      // Get data updated
      let data = await Program.query().where('id', program_id).first()

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

      // All input
      const program_id = request.input('id')

      // Find program
      let findData = await Program.find(program_id)

      // Return false if program not exists
      if (!findData) {
        return response.status(404).send({
          message: 'Program not found',
        })
      }

      // Delete file
      removeFile(
        path.join(Helpers.resourcesPath('uploads/program'), findData.image_name)
      )

      // Delete program
      await Program.query().where('id', program_id).delete()

      return response.send({
        message: 'Program deleted',
      })
    } catch (error) {
      console.log(error.message)
      return response.status(500).send(error.message)
    }
  }
}

module.exports = ProgramController
