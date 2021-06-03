'use strict';

class AdminEvent {
  get rules() {
    const method = this.ctx.request.method();
    const uri = this.ctx.request.url();

    let rules = {
      name: 'required|string',
      content: 'required|string',
      registration_date: 'date',
      expired_date: 'date',
      image: 'required|file|file_ext:png,jpg,jpeg|file_size:5mb',
    };

    switch (method) {
      case 'GET':
        rules = null;
        rules = {
          event_id: 'required|number',
        };
        break;

      case 'POST':
        if (uri == '/api/v1/admin/event') {
          rules = rules;
        }
        break;

      case 'PUT':
        if (uri == '/api/v1/admin/event') {
          rules = null;
          rules = {
            event_id: 'required|number',
            name: 'required|string',
            content: 'required|string',
            registration_date: 'date',
            expired_date: 'date',
          };
        }

        if (uri == '/api/v1/admin/event/dump') {
          rules = null;
          rules = {
            event_id: 'required|number',
          };
        }

        if (uri == '/api/v1/admin/event/restore') {
          rules = null;
          rules = {
            event_id: 'required|number',
          };
        }
        break;

      case 'DELETE':
        if (uri == '/api/v1/admin/event') {
          rules = null;
          rules = {
            event_id: 'required|number',
          };
        }

        if (uri == '/api/v1/admin/event/file') {
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

module.exports = AdminEvent;
