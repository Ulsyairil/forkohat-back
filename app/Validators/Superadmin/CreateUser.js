"use strict";

class SuperadminCreateUser {
  get rules() {
    return {
      // validation rules
      rule_id: "required|number",
      name: "required|string|max:254|unique:users,name",
      email: "required|string|max:254|unique:users,email",
      nip: "string|max:18|unique:users,nip",
      password: "required|string",
      job: "required|string|max:254",
      district: "required|number",
      sub_district: "number",
      gender: "required|in:male,female,secret",
      bio: "string",
    };
  }

  get validateAll() {
    return true;
  }

  async fails(errorMessages) {
    return this.ctx.response.send(errorMessages);
  }
}

module.exports = SuperadminCreateUser;
