"use strict";

class SuperadminEvent {
  get rules() {
    const method = this.ctx.request.method();
    const uri = this.ctx.request.url();

    let rules = {
      order_id: "required|number",
      name: "required|string",
      content: "required|string",
      registration_date: "date",
      expired_date: "date",
      image: "required|file|file_ext:png,jpg,jpeg|file_size:5mb",
      url: "url",
      showed: "required|in:private,member,public",
    };

    switch (method) {
      case "GET":
        rules = null;
        rules = {
          event_id: "required|number",
        };
        break;

      case "POST":
        if (uri == "/api/v1/superadmin/events") {
          rules = null;
          rules = {
            order_id: "required|number",
            showed: "in:private,member,public",
          };
        }

        if (uri == "/api/v1/superadmin/event") {
          rules = rules;
        }
        break;

      case "PUT":
        if (uri == "/api/v1/superadmin/event") {
          rules = null;
          rules = {
            event_id: "required|number",
            name: "required|string",
            content: "required|string",
            registration_date: "date",
            expired_date: "date",
            url: "url",
            showed: "required|in:private,member,public",
          };
        }

        if (uri == "/api/v1/superadmin/event/dump") {
          rules = null;
          rules = {
            event_id: "required|number",
          };
        }

        if (uri == "/api/v1/superadmin/event/restore") {
          rules = null;
          rules = {
            event_id: "required|number",
          };
        }
        break;

      case "DELETE":
        if (uri == "/api/v1/superadmin/event") {
          rules = null;
          rules = {
            event_id: "required|number",
          };
        }

        if (uri == "/api/v1/superadmin/event/file") {
          rules = null;
          rules = {
            file_id: "required|number",
          };
        }
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

module.exports = SuperadminEvent;
