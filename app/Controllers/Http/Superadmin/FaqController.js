'use strict';

const Faq = use('App/Models/Faq');
const FaqTopic = use('App/Models/FaqTopic');
const Moment = require('moment');

class FaqController {
  async index({ request, response }) {
    try {
      let data = await Faq.query().orderBy('id', 'desc').fetch();
      console.log(data);

      return response.send(data);
    } catch (error) {
      console.log(error);
      return response.status(500).send(error);
    }
  }

  async get({ request, response }) {
    try {
      let data = await Faq.find(request.input('faq_id'));

      if (!data) {
        return response.status(404).send({
          message: 'not found',
        });
      }

      return response.send(data);
    } catch (error) {
      console.log(error);
      return response.status(500).send(error);
    }
  }

  async create({ request, response }) {
    try {
      let create = await Faq.create({
        name: request.input('name'),
      });

      return response.send(create);
    } catch (error) {
      console.log(error);
      return response.status(500).send(error);
    }
  }

  async edit({ request, response }) {
    try {
      await Faq.query()
        .where('id', request.input('faq_id'))
        .update({
          name: request.input('name'),
        });

      let data = await Faq.find(request.input('faq_id'));

      return response.send(data);
    } catch (error) {
      console.log(error);
      return response.status(500).send(error);
    }
  }

  async dump({ request, response }) {
    try {
      await Faq.query().where('id', request.input('faq_id')).update({
        deleted_at: Moment.now(),
      });

      let data = await Faq.find(request.input('faq_id'));

      return response.send(data);
    } catch (error) {
      console.log(error);
      return response.status(500).send(error);
    }
  }

  async restore({ request, response }) {
    try {
      await Faq.query().where('id', request.input('faq_id')).update({
        deleted_at: null,
      });

      let data = await Faq.find(request.input('faq_id'));

      return response.send(data);
    } catch (error) {
      console.log(error);
      return response.status(500).send(error);
    }
  }

  async delete({ request, response }) {
    try {
      await FaqTopic.query().where('faq_id', request.input('faq_id')).delete();

      await Faq.query().where('id', request.input('faq_id')).delete();

      return response.send({
        message: 'deleted',
      });
    } catch (error) {
      console.log(error);
      return response.status(500).send(error);
    }
  }
}

module.exports = FaqController;
