'use strict';

class AdminProgram {
  get rules() {
    const method = this.ctx.request.method();
    const uri = this.ctx.request.url();

    let rules = {
      name: 'required|string',
      description: 'required|string',
      image: 'required|file|file_ext:png,jpg,jpeg|file_size:5mb',
    };

    switch (method) {
      case 'GET':
        rules = null;
        rules = {
          program_id: 'required|number',
        };
        break;

      case 'POST':
        rules = rules;
        break;

      case 'PUT':
        if (uri == '/api/v1/superadmin/rule') {
          rules = null;
          rules = {
            program_id: 'required|number',
            name: 'required|string',
            description: 'required|string',
          };
        }

        if (uri == '/api/v1/superadmin/rule/dump') {
          rules = null;
          rules = {
            program_id: 'required|number',
          };
        }

        if (uri == '/api/v1/superadmin/rule/restore') {
          rules = null;
          rules = {
            program_id: 'required|number',
          };
        }
        break;

      case 'DELETE':
        rules = null;
        rules = {
          program_id: 'required|number',
        };
        break;

      default:
        rules = rules;
        break;
    }

    return rules;
  }

  get validateAll() {
    return true;
  }

  async fails(errorMessages) {
    return this.ctx.response.send(errorMessages);
  }
}

module.exports = AdminProgram;
