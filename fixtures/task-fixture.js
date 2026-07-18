import { test as base } from "@playwright/test";

export const test = base.extend({
  page: async ({ page }, use) => {
    let apiUrl = process.env.APP_URL + "api.php";
    // SETUP:
    // clear all tasks via API
    await page.request.post(apiUrl, { data: '{"action":"clear_all"}' });

    // navigate to Home page
    await page.goto(process.env.APP_URL);

    // TEST:
    // Pass the page control over to the test case
    await use(page);

    // TEARDOWN:
    // clear all tasks via API
    await page.request.post(apiUrl, { data: '{"action":"clear_all"}' });
  },
});
