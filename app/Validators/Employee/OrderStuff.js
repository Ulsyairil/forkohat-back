"use strict";

class EmployeeOrderStuff {
  get rules() {
    const method = this.ctx.request.method();
    const uri = this.ctx.request.url();

    let rules = {
      order_id: "required|number",
      name: "required|string",
      description: "required|string",
      showed: "required|in:private,member,public",
    };

    switch (method) {
      case "GET":
        if (uri == "/api/v1/employee/order/stuffs") {
          rules = null;
          rules = {
            order_id: "required|number",
          };
        }

        if (uri == "/api/v1/employee/order/stuff") {
          rules = null;
          rules = {
            id: "required|number",
          };
        }
        break;

      case "POST":
        rules = rules;
        break;

      case "PUT":
        if (uri == "/api/v1/employee/order/stuff") {
          rules = null;
          rules = {
            id: "required|number",
            order_id: "required|number",
            name: "required|string",
            description: "required|string",
            showed: "required|in:private,member,public",
          };
        }

        if (uri == "/api/v1/employee/order/stuff/dump") {
          rules = null;
          rules = {
            id: "required|number",
          };
        }

        if (uri == "/api/v1/employee/order/stuff/restore") {
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

module.exports = EmployeeOrderStuff;
