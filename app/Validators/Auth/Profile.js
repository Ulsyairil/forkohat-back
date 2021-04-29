'use strict';

class AuthProfile {
  get rules() {
    const method = this.ctx.request.method();
    const uri = this.ctx.request.url();

    let rules = {
      name: 'required|string|max:254',
      email: 'required|string|max:254',
      nip: 'string|max:18|unique:users,nip',
      password: 'string',
      confirm_password: 'string|same:password',
      job: 'required|string|max:254',
      district: 'required|number',
      sub_district: 'number',
      gender: 'required|in:male,female,secret',
      bio: 'string',
    };

    switch (method) {
      case 'GET':
        break;

      case 'POST':
        break;

      case 'PUT' || 'PATCH':
        if (uri == '/api/v1/user/profile/edit') {
          rules = rules;
        }

        if (uri == '/api/v1/user/profile/image/edit') {
          rules = null;
          rules = {
            image: 'required|file|file_ext:png,jpg,jpeg|file_size:2mb',
          };
        }
        break;
      case 'DELETE':
        break;

      default:
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

module.exports = AuthProfile;
