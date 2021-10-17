"use strict";

class SuperadminOrderFile {
  get rules() {
    const method = this.ctx.request.method();
    const uri = this.ctx.request.url();

    let rules = {
      order_stuff_id: "required|number",
      file: "required|file|file_ext:pdf",
    };

    switch (method) {
      case "GET":
        rules = null;
        rules = {
          order_stuff_id: "required|number",
        };
        break;

      case "POST":
        if (uri == "/api/v1/superadmin/order/stuff/file") {
          rules = rules;
        }
        break;

      case "PUT":
        if (uri == "/api/v1/superadmin/order/stuff/file") {
          rules = null;
          rules = {
            file: "required|file|file_ext:pdf",
          };
        }

        if (uri == "/api/v1/superadmin/order/stuff/file/dump") {
          rules = null;
          rules = {
            id: "required|number",
          };
        }

        if (uri == "/api/v1/superadmin/order/stuff/file/restore") {
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

module.exports = SuperadminOrderFile;