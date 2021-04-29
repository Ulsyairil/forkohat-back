'use strict';

const Helpers = use('Helpers');
const Order = use('App/Models/Order');
const RandomString = use('randomstring');
const Moment = use('moment');
const { validateAll } = use('Validator');

class OrderController {
  async index({ request, response }) {
    try {
      let queryTotalData = await Order.query().count('* as total');

      let totalData = queryTotalData[0].total;
      console.log(totalData);

      let queryTotalFilteredData = Order.query().with('programs');

      if (request.input('search').value != '') {
        queryTotalFilteredData
          .with('programs', (builder) => {
            builder.where('name', 'like', `%${request.input('search').value}%`);
          })
          .where('name', 'like', `%${request.input('search').value}%`)
          .orWhere('description', 'like', `%${request.input('search').value}%`)
          .orWhere('created_at', 'like', `%${request.input('search').value}%`)
          .orWhere('updated_at', 'like', `%${request.input('search').value}%`)
          .orWhere('deleted_at', 'like', `%${request.input('search').value}%`);
      }

      let count = await queryTotalFilteredData.count('* as total');
      let totalFiltered = count[0].total;

      let getData = Order.query().with('programs');

      if (request.input('search').value != '') {
        getData
          .with('programs', (builder) => {
            builder.where('name', 'like', `%${request.input('search').value}%`);
          })
          .where('name', 'like', `%${request.input('search').value}%`)
          .orWhere('description', 'like', `%${request.input('search').value}%`)
          .orWhere('created_at', 'like', `%${request.input('search').value}%`)
          .orWhere('updated_at', 'like', `%${request.input('search').value}%`)
          .orWhere('deleted_at', 'like', `%${request.input('search').value}%`);
      }

      request.input('order').forEach((value) => {
        getData.orderBy(value.column, value.dir);
      });

      getData.offset(request.input('start')).limit(request.input('length'));

      let data = await getData.fetch();
      console.log(data);

      return response.send({
        draw: Number(request.input('draw')),
        recordsTotal: totalData,
        recordsFiltered: totalFiltered,
        data: data,
      });
    } catch (error) {
      console.log(error);
      return response.status(500).send(error);
    }
  }

  async get({ request, response }) {
    try {
      let data = await Order.query()
        .with('programs')
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
      let create = await Order.create({
        program_id: request.input('program_id'),
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
      let find = await Order.find(request.input('id'));

      if (!find) {
        return response.status(404).send({
          message: 'not found',
        });
      }

      await Order.query()
        .where('id', request.input('id'))
        .update({
          program_id: request.input('program_id'),
          name: request.input('name'),
          description: request.input('description'),
        });

      let data = await Order.query()
        .with('programs')
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
      let find = await Order.find(request.input('id'));

      if (!find) {
        return response.status(404).send({
          message: 'not found',
        });
      }

      await Order.query().where('id', request.input('id')).update({
        deleted_at: Moment.now(),
      });

      let data = await Order.query()
        .with('programs')
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
      let find = await Order.find(request.input('id'));

      if (!find) {
        return response.status(404).send({
          message: 'not found',
        });
      }

      await Order.query().where('id', request.input('id')).update({
        deleted_at: null,
      });

      let data = await Order.query()
        .with('programs')
        .where('id', request.input('id'))
        .first();

      return response.send(data);
    } catch (error) {
      console.log(error);
      return response.status(500).send(error);
    }
  }
}

module.exports = OrderController;
