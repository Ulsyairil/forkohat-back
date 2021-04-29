'use strict';

class EmployeeOrderFile {
  get rules() {
    const method = this.ctx.request.method();
    const uri = this.ctx.request.url();

    let rules = {
      order_stuff_id: 'required|number',
      page: 'required|number',
      image: 'required|file|file_ext:png,jpg,jpeg|file_size:5mb',
    };

    switch (method) {
      case 'GET':
        rules = null;
        rules = {
          order_stuff_id: 'required|number',
        };
        break;

      case 'POST':
        if (uri == '/api/v1/superadmin/order/stuff/file') {
          rules = rules;
        }

        if (uri == '/api/v1/superadmin/order/stuff/file/check') {
          rules = null;
          rules = {
            image: 'required|file|file_ext:png,jpg,jpeg|file_size:5mb',
          };
        }
        break;

      case 'PUT':
        if (uri == '/api/v1/superadmin/order/stuff/file') {
          rules = null;
          rules = {
            page: 'required|number',
          };
        }

        if (uri == '/api/v1/superadmin/order/stuff/file/dump') {
          rules = null;
          rules = {
            id: 'required|number',
          };
        }

        if (uri == '/api/v1/superadmin/order/stuff/file/restore') {
          rules = null;
          rules = {
            id: 'required|number',
          };
        }
        break;

      case 'DELETE':
        rules = null;
        rules = {
          id: 'required|number',
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

module.exports = EmployeeOrderFile;
