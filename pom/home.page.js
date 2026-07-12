const { expect } = require("@playwright/test");
const { text } = require("node:stream/consumers");

class HomePage {
  constructor(page) {
    this.page = page;

    this.title = page.getByTestId("title");
  }

  async navigate() {
    await this.page.goto(process.env.APP_URL);
  }
}

module.exports = { HomePage };
