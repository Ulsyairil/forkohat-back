"use strict";

class SuperadminOrder {
  get rules() {
    const method = this.ctx.request.method();
    const uri = this.ctx.request.url();

    let rules = {
      program_id: "required|number",
      name: "required|string",
      description: "required|string",
    };

    switch (method) {
      case "GET":
        rules = null;
        rules = {
          id: "required|number",
        };
        break;

      case "POST":
        if (uri == "/api/v1/superadmin/orders") {
          rules = null;
          rules = {
            program_id: "required|number",
          };
        }

        if (uri == "/api/v1/superadmin/order") {
          rules = rules;
        }
        break;

      case "PUT":
        if (uri == "/api/v1/superadmin/order") {
          rules = null;
          rules = {
            id: "required|number",
            program_id: "required|number",
            name: "required|string",
            description: "required|string",
          };
        }

        if (uri == "/api/v1/superadmin/order/dump") {
          rules = null;
          rules = {
            id: "required|number",
          };
        }

        if (uri == "/api/v1/superadmin/order/restore") {
          rules = null;
          rules = {
            id: "required|number",
          };
        }
        break;

      case "DELETE":
        rules = null;
        rules = {
          id: "required|number",
        };
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

module.exports = SuperadminOrder;
