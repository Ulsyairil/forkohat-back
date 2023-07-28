'use strict'

class ConvertEmptyStringsToNull {
  async handle({ request, response }, next) {
    try {
      if (Object.keys(request.body).length) {
        request.body = Object.assign(
          ...Object.keys(request.body).map((key) => ({
            [key]: request.body[key] !== '' ? request.body[key] : null,
          }))
        )
      }

      await next()
    } catch (error) {
      return response.status(error.status).send({
        status: error.status,
        message: error.message,
      })
    }
  }
}

module.exports = ConvertEmptyStringsToNull
