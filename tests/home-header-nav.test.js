// @ts-check
import { test, expect } from "@playwright/test";
import { generateExpectedWeekLabel } from "../helpers/date-utils.js";
const { HomePage } = require("../pom/home.page");

test.beforeEach(async ({ page }) => {
  await page.goto(process.env.APP_URL);
});

/*******************
      HEADER
********************/
test("TC-001: Title @smoke @header", async ({ page }) => {
  const home = new HomePage(page);
  await expect(home.title).toHaveText(process.env.APP_TITLE);
});

/*******************
      WEEK LABEL
********************/
test("TC-002: Week Label - Default @smoke @week @week-label", async ({ page }) => {
  const home = new HomePage(page);
  await expect(home.weekLabel).toHaveText(generateExpectedWeekLabel(0));
});

test("TC-003: Week Label - Previous Week @smoke @week @week-label", async ({ page }) => {
  const home = new HomePage(page);
  await home.previousWeekButton.click();
  await expect(home.weekLabel).toHaveText(generateExpectedWeekLabel(-1));
});

test("TC-004: Week Label - Next Week @smoke @week @week-label", async ({ page }) => {
  const home = new HomePage(page);
  await home.nextWeekButton.click();
  await expect(home.weekLabel).toHaveText(generateExpectedWeekLabel(1));
});

/*******************
      WEEK NAV
********************/
test("TC-005: Current Week Button - Default State @smoke @week @week-nav", async ({ page }) => {
  const home = new HomePage(page);
  await expect(home.previousWeekButton).toBeEnabled();
  await expect(home.currentWeekButton).toBeEnabled({ enabled: false });
  await expect(home.nextWeekButton).toBeEnabled();
});

test("TC-006: Previous Week Button - All week navigation buttons enabled @smoke @week @week-nav", async ({ page }) => {
  const home = new HomePage(page);
  await home.previousWeekButton.click();
  await expect(home.previousWeekButton).toBeEnabled();
  await expect(home.currentWeekButton).toBeEnabled();
  await expect(home.nextWeekButton).toBeEnabled();
});

test("TC-007: Next Week Button - All week navigation buttons enabled @smoke @week @week-nav", async ({ page }) => {
  const home = new HomePage(page);
  await home.nextWeekButton.click();
  await expect(home.previousWeekButton).toBeEnabled();
  await expect(home.currentWeekButton).toBeEnabled();
  await expect(home.nextWeekButton).toBeEnabled();
});

test("TC-008: Current Week Button - from Previous Week @smoke @week @week-nav", async ({ page }) => {
  const home = new HomePage(page);
  await home.previousWeekButton.click();
  await home.currentWeekButton.click();
  await expect(home.weekLabel).toHaveText(generateExpectedWeekLabel(0));
  await expect(home.currentWeekButton).toBeEnabled({ enabled: false });
});

test("TC-009: Current Week Button - from Next Week @smoke @week @week-nav", async ({ page }) => {
  const home = new HomePage(page);
  await home.previousWeekButton.click();
  await home.currentWeekButton.click();
  await expect(home.weekLabel).toHaveText(generateExpectedWeekLabel(0));
  await expect(home.currentWeekButton).toBeEnabled({ enabled: false });
});
