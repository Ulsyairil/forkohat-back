"use strict";

class SuperadminGetEvent {
  get rules() {
    return {
      event_id: "required|number",
    };
  }

  get validateAll() {
    return true;
  }

  async fails(errorMessages) {
    return this.ctx.response.send(errorMessages);
  }
}

module.exports = SuperadminGetEvent;
