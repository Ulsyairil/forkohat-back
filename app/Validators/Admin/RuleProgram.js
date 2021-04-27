"use strict";

class AdminRuleProgram {
  get rules() {
    const method = this.ctx.request.method();
    const uri = this.ctx.request.url();

    let rules = {
      rule_id: "required|number",
      program_id: "required|number",
    };

    switch (method) {
      case "GET":
        rules = null;
        rules = {
          rule_id: "required|number",
        };
        break;

      case "POST":
        rules = rules;
        break;

      case "PUT":
        rules = null;
        rules = {
          id: "required|number",
          rule_id: "required|number",
          program_id: "required|number",
        };
        break;

      case "DELETE":
        rules = null;
        rules = {
          id: "required|number",
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

module.exports = AdminRuleProgram;
