const { expect } = require("@playwright/test");
const { text } = require("node:stream/consumers");

class HomePage {
  constructor(page) {
    this.page = page;

    this.title = page.getByTestId("title");

    // WEEK
    this.weekLabel = page.locator("#weekLabel");
    this.previousWeekButton = page.locator("#prevWeek");
    this.currentWeekButton = page.locator("#currentWeek");
    this.nextWeekButton = page.locator("#nextWeek");
  }

  async navigate() {
    await this.page.goto(process.env.APP_URL);
  }
}

module.exports = { HomePage };
