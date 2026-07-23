import { test as base, expect } from "@playwright/test";

export const test = base.extend({
  usernames: async ({}, use) => {
    const users = {
      user1: process.env.USER_1_NAME,
      user2: process.env.USER_2_NAME,
    };

    await use(users);
  },
  page: async ({ page }, use) => {
    let apiUrl = process.env.APP_URL + "api.php";
    // SETUP:
    // clear all tasks via API
    let response = await page.request.post(apiUrl, { data: '{"action":"clear_all"}' });
    await expect(response.ok()).toBeTruthy();

    // navigate to Home page
    await page.goto(process.env.APP_URL);

    // TEST:
    // Pass the page control over to the test case
    await use(page);

    // TEARDOWN:
    // clear all tasks via API
    response = await page.request.post(apiUrl, { data: '{"action":"clear_all"}' });
    await expect(response.ok()).toBeTruthy();
  },
});
