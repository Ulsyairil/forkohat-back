"use strict";

class PublicOrderStuff {
  get rules() {
    const method = this.ctx.request.method();
    const uri = this.ctx.request.url();

    let rules = {
      order_id: "required|number",
      page: "required|number",
      limit: "required|number",
      search: "string",
    };

    switch (method) {
      case "GET":
        rules = null;
        rules = {
          id: "required|number",
        };
        break;

      case "POST":
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

module.exports = PublicOrderStuff;
