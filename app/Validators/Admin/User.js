'use strict';

class AdminUser {
  get rules() {
    const method = this.ctx.request.method();
    const uri = this.ctx.request.url();

    let rules = {
      rule_id: 'required|number',
      name: 'required|string|max:254|unique:users,name',
      email: 'required|string|max:254|unique:users,email',
      nip: 'string|max:18|unique:users,nip',
      password: 'required|string',
      job: 'required|string|max:254',
      district: 'required|number',
      sub_district: 'number',
      gender: 'required|in:male,female,secret',
      bio: 'string',
    };

    switch (method) {
      case 'GET':
        rules = null;
        rules = {
          id: 'required|number',
        };
        break;

      case 'POST':
        if (uri == '/api/v1/admin/user') {
          rules = rules;
        }
        break;

      case 'PUT':
        if (uri == '/api/v1/admin/user') {
          rules = null;
          rules = {
            id: 'required|number',
            rule_id: 'required|number',
            name: 'required|string|max:254',
            email: 'required|string|max:254',
            nip: 'string|max:18',
            password: 'required|string',
            job: 'required|string|max:254',
            district: 'required|number',
            sub_district: 'number',
            gender: 'required|in:male,female,secret',
            bio: 'string',
          };
        }

        if (uri == '/api/v1/admin/user/dump') {
          rules = null;
          rules = {
            id: 'required|number',
          };
        }

        if (uri == '/api/v1/admin/user/restore') {
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

module.exports = AdminUser;
