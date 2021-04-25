"use strict";

class SuperadminEditNews {
  get rules() {
    return {
      // validation rules
      id: "required|number",
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

module.exports = SuperadminEditNews;
