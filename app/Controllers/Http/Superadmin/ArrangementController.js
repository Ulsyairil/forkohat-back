'use strict'

const Helpers = use('Helpers')
const fs = use('fs')
const path = use('path')
const removeFile = Helpers.promisify(fs.unlink)
const Arrangement = use('App/Models/Arrangement')
const Moment = require('moment')
const { validate } = use('Validator')
const Program = use('App/Models/Program')
const RandomString = require('randomstring')
const voca = require('voca')

class ArrangementController {
  async index({ request, response }) {
    try {
      // Validate request
      const rules = {
        program_id: 'required|integer',
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
      const program_id = request.input('program_id')
      const page = request.input('page')
      const limit = request.input('limit')
      const order = request.input('order')
      const search = request.input('search')

      // Find program data
      let findProgram = await Program.find(program_id)

      // Check program exist
      if (!findProgram) {
        return response.status(404).send({
          message: 'Program Tidak Ditemukan',
        })
      }

      // Arrangement query
      let query = Arrangement.query()

      // Search arrangement query
      if (search) {
        query
          .where('title', 'like', `%${search}%`)
          .orWhere('description', 'like', `%${search}%`)
      }

      // Get arrangement data
      const data = await query
        .where('program_id', program_id)
        .orderBy('id', order)
        .paginate(page, limit)
      console.log(data)

      return response.status(200).send(data)
    } catch (error) {
      console.log(error.message)
      return response.status(500).send(error.message)
    }
  }

  async indexAll({ request, response }) {
    try {
      // Validate request
      const rules = {
        program_id: 'required|integer',
      }

      const validation = await validate(request.all(), rules)

      if (validation.fails()) {
        return response.status(422).send(validation.messages()[0])
      }

      // All input
      const program_id = request.input('program_id')

      // Find program data
      let findProgram = await Program.find(program_id)

      // Check program exist
      if (!findProgram) {
        return response.status(404).send({
          message: 'Program Tidak Ditemukan',
        })
      }

      // Get arrangement data
      const data = await Arrangement.query()
        .where('program_id', program_id)
        .orderBy('title', 'asc')
        .fetch()
      console.log(data)

      return response.status(200).send(data)
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
      const arrangement_id = request.input('id')

      // Get data
      let data = await Arrangement.query()
        .with('Program')
        .where('id', arrangement_id)
        .first()

      // Check if data exist
      if (!data) {
        return response.send({
          message: 'Tatanan Tidak Ditemukan',
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
        program_id: 'required|integer',
        title: 'required|string',
        description: 'string',
      }

      const validation = await validate(request.all(), rules)

      if (validation.fails()) {
        return response.status(422).send(validation.messages()[0])
      }

      // All input
      const program_id = request.input('program_id')
      const title = request.input('title')
      const description = request.input('description')
      const image = request.file('image', {
        extnames: ['png', 'jpg', 'jpeg'],
      })

      // Check if input image is null
      if (image == null) {
        return response.status(422).send({
          message: 'Logo Harus Diunggah',
        })
      }

      // Find program data
      let findProgram = await Program.find(program_id)

      // Check program exist
      if (!findProgram) {
        return response.status(404).send({
          message: 'Program Tidak Ditemukan',
        })
      }

      let random = RandomString.generate({
        capitalization: 'lowercase',
      })

      // Move image
      let fileName = `${random}_${new Date().toJSON().slice(0, 10)}.${
        image.extname
      }`

      await image.move(Helpers.resourcesPath('uploads/arrangements'), {
        name: fileName,
      })

      if (!image.moved()) {
        return response.status(422).send(image.errors())
      }

      // Create data
      const create = await Arrangement.create({
        program_id: program_id,
        title: title,
        description: description,
        image_name: fileName,
        image_mime: image.extname,
        image_path: Helpers.resourcesPath('uploads/arrangements'),
        image_url: `/api/v1/file/${image.extname}/${fileName}`,
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

      // All input
      const arrangement_id = request.input('id')
      const title = request.input('title')
      const description = request.input('description')
      const image = request.file('image', {
        extnames: ['png', 'jpg', 'jpeg'],
      })

      // Find data
      let find = await Arrangement.find(arrangement_id)

      // Check if data exist
      if (!find) {
        return response.status(400).send({
          message: 'Tatanan Tidak Ditemukan',
        })
      }

      let random = RandomString.generate({
        capitalization: 'lowercase',
      })

      // Upload image
      let fileName, payload
      if (image) {
        let findImage = await Arrangement.query()
          .where('id', arrangement_id)
          .first()

        fileName = `${random}_${new Date().toJSON().slice(0, 10)}.${
          image.extname
        }`

        await image.move(Helpers.resourcesPath('uploads/arrangements'), {
          name: fileName,
        })

        if (!image.moved()) {
          return response.status(422).send(image.errors())
        }

        removeFile(
          path.join(
            Helpers.resourcesPath('uploads/arrangements'),
            findImage.image_name,
          ),
        )

        payload = {
          title: title,
          description: description,
          image_name: fileName,
          image_mime: image.extname,
          image_path: Helpers.resourcesPath('uploads/arrangements'),
          image_url: `/api/v1/file/${image.extname}/${fileName}`,
        }
      } else {
        payload = {
          title: title,
          description: description,
        }
      }

      // Update data
      await Arrangement.query().where('id', arrangement_id).update(payload)

      // Get updated data
      let data = await Arrangement.query()
        .with('Program')
        .where('id', arrangement_id)
        .first()

      return response.send(data)
    } catch (error) {
      console.log(error.message)
      return response.status(500).send(error.message)
    }
  }

  // async dump({ request, response }) {
  //   try {
  //     // Validate request
  //     const rules = {
  //       arrangement_id: "required|integer",
  //     };

  //     const validation = await validate(request.all(), rules);

  //     if (validation.fails()) {
  //       return response.status(422).send(validation.messages()[0]);
  //     }

  //     // All input
  //     const arrangement_id = request.input("arrangement_id");

  //     // Find data
  //     let find = await Arrangement.find(arrangement_id);

  //     // Check if data exist
  //     if (!find) {
  //       return response.status(400).send({
  //         message: "Tatanan Tidak Ditemukan",
  //       });
  //     }

  //     // Dump data
  //     await Arrangement.query().where("id", arrangement_id).update({
  //       deleted_at: Moment.now(),
  //     });

  //     // Get dumped data
  //     let data = await Arrangement.query()
  //       .with("programs")
  //       .where("id", arrangement_id)
  //       .first();

  //     return response.send(data);
  //   } catch (error) {
  //     console.log(error.message);
  //     return response.status(500).send(error.message);
  //   }
  // }

  // async restore({ request, response }) {
  //   try {
  //     // Validate request
  //     const rules = {
  //       arrangement_id: "required|integer",
  //     };

  //     const validation = await validate(request.all(), rules);

  //     if (validation.fails()) {
  //       return response.status(422).send(validation.messages()[0]);
  //     }

  //     // All input
  //     const arrangement_id = request.input("arrangement_id");

  //     // Find data
  //     let find = await Arrangement.find(arrangement_id);

  //     // Check if data exist
  //     if (!find) {
  //       return response.status(400).send({
  //         message: "Tatanan Tidak Ditemukan",
  //       });
  //     }

  //     // Restore data
  //     await Arrangement.query().where("id", arrangement_id).update({
  //       deleted_at: null,
  //     });

  //     // Get restored data
  //     let data = await Arrangement.query()
  //       .with("Program")
  //       .where("id", arrangement_id)
  //       .first();

  //     return response.send(data);
  //   } catch (error) {
  //     console.log(error.message);
  //     return response.status(500).send(error.message);
  //   }
  // }

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
      const arrangement_id = request.input('id')

      // Find data
      let find = await Arrangement.find(arrangement_id)

      // Check if data exist
      if (!find) {
        return response.status(400).send({
          message: 'Tatanan Tidak Ditemukan',
        })
      }

      // Delete data
      await Arrangement.query().where('id', arrangement_id).delete()

      return response.send({
        message: 'Arrangement deleted',
      })
    } catch (error) {
      console.log(error.message)
      return response.status(500).send(error.message)
    }
  }
}

module.exports = ArrangementController
