'use strict';

const ProgramRuled = use('App/Models/ProgramRuled');

class ProgramRuledController {
  async index({ request, response }) {
    try {
      let data = await ProgramRuled.query()
        .with('rules')
        .with('programs')
        .where('rule_id', request.input('rule_id'))
        .fetch();

      return response.send(data);
    } catch (error) {
      console.log(error);
      return response.status(500).send(error);
    }
  }

  async create({ request, response }) {
    try {
      let ruled = await ProgramRuled.create({
        rule_id: request.input('rule_id'),
        program_id: request.input('program_id'),
      });

      let data = await ProgramRuled.query()
        .with('rules')
        .with('programs')
        .where('id', ruled.id)
        .first();

      return response.send(data);
    } catch (error) {
      console.log(error);
      return response.status(500).send(error);
    }
  }

  async edit({ request, response }) {
    try {
      await ProgramRuled.query()
        .where('id', request.input('id'))
        .update({
          rule_id: request.input('rule_id'),
          program_id: request.input('program_id'),
        });

      let data = await ProgramRuled.query()
        .with('rules')
        .with('programs')
        .where('id', request.input('id'))
        .first();

      return response.send(data);
    } catch (error) {
      console.log(error);
      return response.status(500).send(error);
    }
  }

  async delete({ request, response }) {
    try {
      await ProgramRuled.query().where('id', request.input('id')).delete();

      return response.send({
        message: 'deleted',
      });
    } catch (error) {
      console.log(error);
      return response.status(500).send(error);
    }
  }
}

module.exports = ProgramRuledController;
