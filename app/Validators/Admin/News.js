'use strict';

class AdminNews {
  get rules() {
    const method = this.ctx.request.method();
    const uri = this.ctx.request.url();

    let rules = {
      title: 'required|string|max:254',
      content: 'required|string',
      image: 'required|file|file_ext:png,jpg,jpeg|file_size:5mb',
    };

    switch (method) {
      case 'GET':
        rules = null;
        rules = {
          id: 'required|number',
        };
        break;

      case 'POST':
        if (uri == '/api/v1/admin/news/add') {
          rules = rules;
        }
        break;

      case 'PUT':
        if (uri == '/api/v1/admin/news') {
          rules = null;
          rules = {
            id: 'required|number',
            title: 'required|string|max:254',
            content: 'required|string',
          };
        }

        if (uri == '/api/v1/admin/news/dump') {
          rules = null;
          rules = {
            id: 'required|number',
          };
        }

        if (uri == '/api/v1/admin/news/restore') {
          rules = null;
          rules = {
            id: 'required|number',
          };
        }
        break;

      case 'DELETE':
        if (uri == '/api/v1/admin/news') {
          rules = null;
          rules = {
            id: 'required|number',
          };
        }

        if (uri == '/api/v1/admin/news/file') {
          rules = null;
          rules = {
            file_id: 'required|number',
          };
        }
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

module.exports = AdminNews;
