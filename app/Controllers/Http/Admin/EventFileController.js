'use strict'

const Helpers = use('Helpers')
const fs = use('fs')
const path = use('path')
const removeFile = Helpers.promisify(fs.unlink)
const Event = use('App/Models/Event')
const EventFile = use('App/Models/EventFile')
const RandomString = require('randomstring')
const voca = require('voca')
const { validate } = use('Validator')

class EventFileController {
  async index({ request, response }) {
    try {
      const rules = {
        event_id: 'required|integer',
        page: 'required|integer',
        limit: 'required|integer',
        order: 'required|in:asc,desc',
      }

      const validation = await validate(request.all(), rules)

      if (validation.fails()) {
        return response.status(422).send(validation.messages()[0])
      }

      const page = request.input('page')
      const limit = request.input('limit')
      const order = request.input('order')
      const event_id = request.input('event_id')

      const findEvent = await Event.find(event_id)

      if (!findEvent) {
        return response.status(404).send({
          message: 'Kegiatan Tidak Ditemukan',
        })
      }

      const data = await EventFile.query()
        .where('event_id', event_id)
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

      const id = request.input('id')

      if (validation.fails()) {
        return response.status(422).send(validation.messages()[0])
      }

      const data = await EventFile.query().where('id', id).first()

      if (data == null) {
        return response.status(404).send({
          message: 'File Tidak Ditemukan',
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
      const rules = {
        event_id: 'required|integer',
        title: 'required|max:254',
      }

      const validation = await validate(request.all(), rules)

      if (validation.fails()) {
        return response.status(422).send(validation.messages()[0])
      }

      const event_id = request.input('event_id')
      const title = request.input('title')
      const file = request.file('file')

      if (file == null) {
        return response.status(400).send({
          message: 'Berkas harus diunggah',
        })
      }

      let random = RandomString.generate({
        capitalization: 'lowercase',
      })

      let fileName = `${random}_${new Date().toJSON().slice(0, 10)}.${
        file.extname
      }`

      await file.move(Helpers.resourcesPath('uploads/event'), {
        name: fileName,
      })

      if (!file.moved()) {
        return response.status(422).send(file.errors())
      }

      let create = await EventFile.create({
        event_id: event_id,
        title: title,
        name: voca.titleCase(file.fileName),
        mime: file.extname,
        path: Helpers.resourcesPath('uploads/event'),
        url: `/api/v1/file/${file.extname}/${file.fileName}`,
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
        event_id: 'required|integer',
        title: 'required|max:254',
      }

      const validation = await validate(request.all(), rules)

      if (validation.fails()) {
        return response.status(422).send(validation.messages()[0])
      }

      // All input
      const id = request.input('id')
      const event_id = request.input('event_id')
      const title = request.input('title')
      const file = request.file('file')

      const findData = await EventFile.query()
        .where('id', id)
        .where('event_id', event_id)
        .first()

      if (findData == null) {
        return response.status(404).send({
          message: 'Berkas Tidak Ditemukan',
        })
      }

      const query = EventFile.query()

      if (file) {
        // Delete file
        removeFile(
          path.join(Helpers.resourcesPath('uploads/event'), findData.name),
        )

        // Move uploaded file
        let random = RandomString.generate({
          capitalization: 'lowercase',
        })

        let fileName = `${random}_${new Date().toJSON().slice(0, 10)}.${
          file.extname
        }`

        await file.move(Helpers.resourcesPath('uploads/event'), {
          name: fileName,
        })

        if (!file.moved()) {
          return response.status(422).send(file.error())
        }

        await query.where('id', id).update({
          event_id: event_id,
          title: title,
          name: voca.titleCase(file.fileName),
          mime: file.extname,
          path: Helpers.resourcesPath('uploads/event'),
          url: `/api/v1/file/${file.extname}/${file.fileName}`,
        })
      } else {
        await query.where('id', id).update({
          event_id: event_id,
          title: title,
        })
      }

      const updatedData = await EventFile.query().where('id', id).first()

      return response.status(200).send(updatedData)
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

      const file_id = request.input('id')

      const findFile = await EventFile.query().where('id', file_id).first()

      if (!findFile) {
        return response.status(404).send({
          message: 'Event file not found',
        })
      }

      removeFile(path.join(findFile.path, findFile.name))

      await EventFile.query().where('id', file_id).delete()

      return response.send({
        message: 'Event file deleted',
      })
    } catch (error) {
      console.log(error.message)
      return response.status(500).send(error.message)
    }
  }
}

module.exports = EventFileController
