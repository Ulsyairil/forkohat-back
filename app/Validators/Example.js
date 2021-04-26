"use strict";

class Example {
  get rules() {
    const method = this.ctx.request.method();
    // example value = GET,POST,PUT,PATCH,DELETE,etc
    const uri = this.ctx.request.url();
    // example value = /api/v1/test

    let rules = {
      // Set rule here
    };

    switch (method) {
      case "GET":
        // Set rule here
        break;

      case "POST":
        // Set rule here
        break;

      case "PUT" || "PATCH":
        // Set rule here
        break;

      case "DELETE":
        // Set rule here
        break;

      default:
        // Set default rule here
        break;
    }

    return rules;
  }

  // Don't forget to use this code
  get validateAll() {
    return true;
  }

  async fails(errorMessages) {
    return this.ctx.response.send(errorMessages);
  }
}

module.exports = Example;
