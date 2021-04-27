"use strict";

class SuperadminFaqTopic {
  get rules() {
    const method = this.ctx.request.method();
    const uri = this.ctx.request.url();

    let rules = {
      faq_id: "required|number",
      title: "required|string",
      description: "required|string",
    };

    switch (method) {
      case "GET":
        rules = null;
        rules = {
          faq_id: "required|number",
        };
        break;

      case "POST":
        rules = rules;
        break;

      case "PUT":
        if (uri == "/api/v1/superadmin/faq/topic") {
          rules = null;
          rules = {
            id: "required|number",
            faq_id: "required|number",
            title: "required|string",
            description: "required|string",
          };
        }

        if (uri == "/api/v1/superadmin/faq/topic/dump") {
          rules = null;
          rules = {
            id: "required|number",
          };
        }

        if (uri == "/api/v1/superadmin/faq/topic/restore") {
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

module.exports = SuperadminFaqTopic;
