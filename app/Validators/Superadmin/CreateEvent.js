"use strict";

class SuperadminCreateEvent {
  get rules() {
    return {
      name: "required|string",
      content: "required|string",
      registration_date: "date",
      expired_date: "date",
      image:
        "required|file|file_ext:png,jpg,jpeg|file_size:5mb",
    };
  }

  get validateAll() {
    return true;
  }

  async fails(errorMessages) {
    return this.ctx.response.send(errorMessages);
  }
}

module.exports = SuperadminCreateEvent;
