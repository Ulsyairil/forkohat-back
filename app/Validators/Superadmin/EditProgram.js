"use strict";

class SuperadminEditProgram {
  get rules() {
    return {
      // validation rules
      program_id: "required|number",
      name: "required|string",
      description: "required|string",
    };
  }

  get validateAll() {
    return true;
  }

  async fails(errorMessages) {
    return this.ctx.response.send(errorMessages);
  }
}

module.exports = SuperadminEditProgram;
