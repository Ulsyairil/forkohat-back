"use strict";

class SuperadminCreateRule {
  get rules() {
    return {
      // validation rules
      rule: "required|string",
    };
  }

  get validateAll() {
    return true;
  }

  async fails(errorMessages) {
    return this.ctx.response.send(errorMessages);
  }
}

module.exports = SuperadminCreateRule;
