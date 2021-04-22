"use strict";

class SuperadminGetRule {
  get rules() {
    return {
      // validation rules
      rule_id: "required|number",
    };
  }

  get validateAll() {
    return true;
  }

  async fails(errorMessages) {
    return this.ctx.response.send(errorMessages);
  }
}

module.exports = SuperadminGetRule;
