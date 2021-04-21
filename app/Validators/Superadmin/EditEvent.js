"use strict";

class SuperadminEditEvent {
  get rules() {
    return {
      event_id: "required|number",
      name: "required|string",
      content: "required|string",
      registration_date: "date",
      expired_date: "date",
    };
  }

  get validateAll() {
    return true;
  }

  async fails(errorMessages) {
    return this.ctx.response.send(errorMessages);
  }
}

module.exports = SuperadminEditEvent;
