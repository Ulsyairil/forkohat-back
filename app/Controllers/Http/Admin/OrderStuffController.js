'use strict';

const OrderStuff = use('App/Models/OrderStuff');
const Moment = require('moment');

class OrderStuffController {
  async index({ request, response }) {
    try {
      let data = await OrderStuff.query()
        .where('order_id', request.input('order_id'))
        .fetch();

      return response.send(data);
    } catch (error) {
      console.log(error);
      return response.status(500).send(error);
    }
  }

  async get({ request, response }) {
    try {
      let data = await OrderStuff.query()
        .with('orders')
        .where('id', request.input('id'))
        .first();

      if (!data) {
        return response.send({
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
      let create = await OrderStuff.create({
        order_id: request.input('order_id'),
        name: request.input('name'),
        description: request.input('description'),
      });

      return response.send(create);
    } catch (error) {
      console.log(error);
      return response.status(500).send(error);
    }
  }

  async edit({ request, response }) {
    try {
      let find = await OrderStuff.find(request.input('id'));

      if (!find) {
        return response.status(404).send({
          message: 'not found',
        });
      }

      await OrderStuff.query()
        .where('id', request.input('id'))
        .update({
          order_id: request.input('order_id'),
          name: request.input('name'),
          description: request.input('description'),
        });

      let data = await OrderStuff.query()
        .with('orders')
        .where('id', request.input('id'))
        .first();

      return response.send(data);
    } catch (error) {
      console.log(error);
      return response.status(500).send(error);
    }
  }

  async dump({ request, response }) {
    try {
      let find = await OrderStuff.find(request.input('id'));

      if (!find) {
        return response.status(404).send({
          message: 'not found',
        });
      }

      await OrderStuff.query().where('id', request.input('id')).update({
        deleted_at: Moment.now(),
      });

      let data = await OrderStuff.query()
        .with('orders')
        .where('id', request.input('id'))
        .first();

      return response.send(data);
    } catch (error) {
      console.log(error);
      return response.status(500).send(error);
    }
  }

  async restore({ request, response }) {
    try {
      let find = await OrderStuff.find(request.input('id'));

      if (!find) {
        return response.status(404).send({
          message: 'not found',
        });
      }

      await OrderStuff.query().where('id', request.input('id')).update({
        deleted_at: null,
      });

      let data = await OrderStuff.query()
        .with('orders')
        .where('id', request.input('id'))
        .first();

      return response.send(data);
    } catch (error) {
      console.log(error);
      return response.status(500).send(error);
    }
  }
}

module.exports = OrderStuffController;
