"use strict";

class SuperadminEditUser {
  get rules() {
    return {
      // validation rules
      id: "required|number",
      rule_id: "required|number",
      name: "required|string|max:254",
      email: "required|string|max:254",
      nip: "string|max:18",
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

module.exports = SuperadminEditUser;
