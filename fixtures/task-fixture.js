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
    const appUrl = new URL(process.env.APP_URL);
    const accessKey = appUrl.hash.split("#access_key=")[1];
    if (!accessKey) {
      throw new Error("APP_URL must include #access_key=... for task reset requests");
    }
    appUrl.hash = "";
    const apiUrl = new URL("api.php", appUrl);
    apiUrl.searchParams.set("access_key", accessKey);
    // SETUP:
    // clear all tasks via API
    let response = await page.request.post(apiUrl.toString(), {
      data: JSON.stringify({ action: "clear_all", access_key: accessKey }),
    });
    await expect(response.ok()).toBeTruthy();

    // navigate to Home page
    await page.goto(process.env.APP_URL);

    // TEST:
    // Pass the page control over to the test case
    await use(page);

    // TEARDOWN:
    // clear all tasks via API
    response = await page.request.post(apiUrl.toString(), {
      data: JSON.stringify({ action: "clear_all", access_key: accessKey }),
    });
    await expect(response.ok()).toBeTruthy();
  },
});
