const { expect } = require("@playwright/test");
const { text } = require("node:stream/consumers");

class HomePage {
  constructor(page) {
    this.page = page;

    this.title = page.locator("body > main > header > h1:nth-child(2)"); //TODO: add test id on website, this is locator is very flakey
  }

  async navigate() {
    await this.page.goto(process.env.APP_URL);
  }
}

module.exports = { HomePage };
