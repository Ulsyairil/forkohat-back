"use strict";

class SuperadminEditRule {
  get rules() {
    return {
      // validation rules
      rule_id: "required|number",
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

module.exports = SuperadminEditRule;
