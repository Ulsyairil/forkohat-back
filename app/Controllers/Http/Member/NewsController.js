'use strict'

const Helpers = use('Helpers')
const fs = use('fs')
const path = use('path')
const removeFile = Helpers.promisify(fs.unlink)
const News = use('App/Models/News')
const RandomString = require('randomstring')
const Moment = require('moment')
const voca = require('voca')
const { validate } = use('Validator')

class NewsController {
  async index({ auth, request, response }) {
    try {
      const rules = {
        page: 'required|integer',
        limit: 'required|integer',
        order: 'required|in:asc,desc',
        search: 'string',
        trash: 'required|boolean',
      }

      const validation = await validate(request.all(), rules)

      if (validation.fails()) {
        return response.status(422).send(validation.messages()[0])
      }

      const page = request.input('page')
      const limit = request.input('limit')
      const order = request.input('order')
      const search = request.input('search')
      const trash = request.input('trash')
      const userLogged = await auth.getUser()

      // Get data
      let query = News.query().with('Author')

      if (search) {
        query
          .where('title', 'like', `%${search}%`)
          .orWhere('content', 'like', `%${search}%`)
      }

      if (trash == '0' || trash == false) {
        query.whereNull('deleted_at')
      }

      if (trash == '1' || trash == true) {
        query.whereNotNull('deleted_at')
      }

      let data = await query
        .where('author_id', userLogged.id)
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

      const news_id = request.input('id')

      let data = await News.query().with('Author').where('id', news_id).first()

      if (!data) {
        return response.status(404).send({
          message: 'News not found',
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
        title: 'required|string',
        content: 'required|string ',
      }

      const validation = await validate(request.all(), rules)

      if (validation.fails()) {
        return response.status(422).send(validation.messages()[0])
      }

      const user = await auth.getUser()
      const title = request.input('title')
      const content = request.input('content')
      const image = request.file('image', {
        extnames: ['png', 'jpg', 'jpeg'],
      })

      if (!image) {
        return response.status(422).send({
          message: 'News Gambar Harus Diunggah',
        })
      }

      let random = RandomString.generate({
        capitalization: 'lowercase',
      })

      let fileName = `${random}_${new Date().toJSON().slice(0, 10)}.${
        image.extname
      }`

      await image.move(Helpers.resourcesPath('uploads/news'), {
        name: fileName,
      })

      if (!image.moved()) {
        return response.status(422).send(image.error())
      }

      // Create data
      let news = await News.create({
        author_id: user.id,
        title: title,
        content: content,
        image_name: fileName,
        image_mime: image.extname,
        image_path: Helpers.resourcesPath('uploads/news'),
        image_url: `/api/v1/file/${image.extname}/${fileName}`,
      })

      // Get data created
      let data = await News.query().with('Author').where('id', news.id).first()

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
        title: 'required|string',
        content: 'required|string ',
      }

      const validation = await validate(request.all(), rules)

      if (validation.fails()) {
        return response.status(422).send(validation.messages()[0])
      }

      const news_id = request.input('id')
      const title = request.input('title')
      const content = request.input('content')
      const image = request.file('image', {
        extnames: ['png', 'jpg', 'jpeg'],
      })

      let findNews = await News.find(news_id)

      if (!findNews) {
        return response.status(404).send({
          message: 'News not found',
        })
      }

      let random = RandomString.generate({
        capitalization: 'lowercase',
      })

      let fileName
      if (image) {
        removeFile(
          path.join(Helpers.resourcesPath('uploads/news'), findNews.image_name),
        )

        fileName = `${random}_${new Date().toJSON().slice(0, 10)}.${
          image.extname
        }`

        await image.move(Helpers.resourcesPath('uploads/news'), {
          name: fileName,
        })

        if (!image.moved()) {
          return response.status(422).send(image.error())
        }
      }

      let query = News.query().where('id', news_id)

      // Update news table
      if (image) {
        await query.update({
          title: title,
          content: content,
          image_name: fileName,
          image_mime: image.extname,
          image_path: Helpers.resourcesPath('uploads/news'),
          image_url: `/api/v1/file/${image.extname}/${fileName}`,
        })
      } else {
        await query.update({
          title: title,
          content: content,
        })
      }

      // Get data created
      let data = await News.query().with('Author').where('id', news_id).first()

      return response.send(data)
    } catch (error) {
      console.log(error.message)
      return response.status(500).send(error.message)
    }
  }

  async dump({ request, response }) {
    try {
      const rules = {
        id: 'required|integer',
      }

      const validation = await validate(request.all(), rules)

      if (validation.fails()) {
        return response.status(422).send(validation.messages()[0])
      }

      const news_id = request.input('id')

      let findNews = await News.find(news_id)

      if (!findNews) {
        return response.status(404).send({
          message: 'News not found',
        })
      }

      await News.query().where('id', news_id).update({
        deleted_at: Moment.now(),
      })

      // Get data created
      let data = await News.query().with('Author').where('id', news_id).first()

      return response.send(data)
    } catch (error) {
      console.log(error.message)
      return response.status(500).send(error.message)
    }
  }

  async restore({ request, response }) {
    try {
      const rules = {
        id: 'required|integer',
      }

      const validation = await validate(request.all(), rules)

      if (validation.fails()) {
        return response.status(422).send(validation.messages()[0])
      }

      const news_id = request.input('id')

      let findNews = await News.find(news_id)

      if (!findNews) {
        return response.status(404).send({
          message: 'News not found',
        })
      }

      await News.query().where('id', news_id).update({
        deleted_at: null,
      })

      // Get data created
      let data = await News.query().with('Author').where('id', news_id).first()

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

      const news_id = request.input('id')

      const findNews = await News.find(news_id)

      if (!findNews) {
        return response.status(404).send({
          message: 'News not found',
        })
      }

      removeFile(path.join(findNews.path, findNews.picture_name))

      await News.query().where('id', news_id).delete()

      return response.send({
        message: 'News deleted',
      })
    } catch (error) {
      console.log(error.message)
      return response.status(500).send(error.message)
    }
  }
}

module.exports = NewsController
