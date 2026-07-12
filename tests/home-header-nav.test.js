// @ts-check
import { test, expect } from "@playwright/test";
const { HomePage } = require("../pom/home.page");

test("TC001: home page has title @smoke", async ({ page }) => {
  const home = new HomePage(page);
  await home.navigate();
  await expect(home.title).toHaveText(process.env.APP_TITLE);
});
