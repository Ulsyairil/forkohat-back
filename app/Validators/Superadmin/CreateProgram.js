"use strict";

class SuperadminCreateProgram {
  get rules() {
    return {
      // validation rules
      name: "required|string",
      description: "required|string",
      image: "required|file|file_ext:png,jpg,jpeg|file_size:5mb",
    };
  }

  get validateAll() {
    return true;
  }

  async fails(errorMessages) {
    return this.ctx.response.send(errorMessages);
  }
}

module.exports = SuperadminCreateProgram;
