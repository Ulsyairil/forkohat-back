'use strict';

class SuperadminFaq {
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
        rules = rules;
        break;

      case 'PUT':
        if (uri == '/api/v1/superadmin/faq') {
          rules = null;
          rules = {
            faq_id: 'required|number',
            name: 'required|string',
          };
        }

        if (uri == '/api/v1/superadmin/faq/dump') {
          rules = null;
          rules = {
            faq_id: 'required|number',
          };
        }

        if (uri == '/api/v1/superadmin/faq/restore') {
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

module.exports = SuperadminFaq;
