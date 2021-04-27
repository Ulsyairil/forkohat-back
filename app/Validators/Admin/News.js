"use strict";

class AdminNews {
  get rules() {
    const method = this.ctx.request.method();
    const uri = this.ctx.request.url();

    let rules = {
      title: "required|string|max:254",
      content: "required|string",
      date: "required|date",
      image: "required|file|file_ext:png,jpg,jpeg|file_size:5mb",
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

      case "PUT":
        if (uri == "/api/v1/superadmin/news") {
          rules = null;
          rules = {
            id: "required|number",
            title: "required|string|max:254",
            content: "required|string",
            date: "required|date",
          };
        }

        if (uri == "/api/v1/superadmin/news/dump") {
          rules = null;
          rules = {
            id: "required|number",
          };
        }

        if (uri == "/api/v1/superadmin/news/restore") {
          rules = null;
          rules = {
            id: "required|number",
          };
        }
        break;

      case "DELETE":
        if (uri == "/api/v1/superadmin/news") {
          rules = null;
          rules = {
            id: "required|number",
          };
        }

        if (uri == "/api/v1/superadmin/news/file") {
          rules = null;
          rules = {
            file_id: "required|number",
          };
        }
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

module.exports = AdminNews;
