"use strict";

class SuperadminGetProgram {
  get rules() {
    return {
      program_id: "required|number",
    };
  }

  get validateAll() {
    return true;
  }

  async fails(errorMessages) {
    return this.ctx.response.send(errorMessages);
  }
}

module.exports = SuperadminGetProgram;
