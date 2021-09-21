"use strict";

class AdminGallery {
  get rules() {
    const method = this.ctx.request.method();
    const uri = this.ctx.request.url();

    let rules = {
      picture_name: "required|string",
      picture_description: "string",
      image: "required|file|file_ext:png,jpg,jpeg|file_size:5mb",
    };

    switch (method) {
      case "POST":
        if (uri == "/api/v1/admin/galleries") {
          rules = null;
          rules = {
            page: "required|number",
            limit: "required|number",
            order: "required|in:asc,desc",
            search: "string",
          };
        }

        if (uri == "/api/v1/admin/gallery") {
          rules = rules;
        }
        break;

      case "DELETE":
        rules = null;
        rules = {
          gallery_id: "required|number",
        };
        break;
    }

    return rules;
  }

  get messages() {
    return {
      "order.in": "Order must be filled `asc` or `desc`",
    };
  }

  get validateAll() {
    return true;
  }

  async fails(errorMessages) {
    return this.ctx.response.send(errorMessages);
  }
}

module.exports = AdminGallery;
