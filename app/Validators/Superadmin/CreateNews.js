"use strict";

class SuperadminCreateNews {
  get rules() {
    return {
      // validation rules
      title: "required|string|max:254",
      content: "required|string",
      date: "required|date",
    };
  }

  get validateAll() {
    return true;
  }

  async fails(errorMessages) {
    return this.ctx.response.send(errorMessages);
  }
}

module.exports = SuperadminCreateNews;
