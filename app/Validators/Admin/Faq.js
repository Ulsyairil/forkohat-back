'use strict';

class AdminFaq {
  get rules() {
    const method = this.ctx.request.method();
    const uri = this.ctx.request.url();

    let rules = {
      name: 'required|string',
    };

    switch (method) {
      case 'GET':
        rules = null;
        rules = {
          faq_id: 'required|number',
        };
        break;

      case 'POST':
        if (uri == '/api/v1/admin/faq') {
          rules = rules;
        }
        break;

      case 'PUT':
        if (uri == '/api/v1/admin/faq') {
          rules = null;
          rules = {
            faq_id: 'required|number',
            name: 'required|string',
          };
        }

        if (uri == '/api/v1/admin/faq/dump') {
          rules = null;
          rules = {
            faq_id: 'required|number',
          };
        }

        if (uri == '/api/v1/admin/faq/restore') {
          rules = null;
          rules = {
            faq_id: 'required|number',
          };
        }
        break;

      case 'DELETE':
        rules = null;
        rules = {
          faq_id: 'required|number',
        };
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

module.exports = AdminFaq;
