// @ts-check

import { test as base, expect } from "@playwright/test";
import { taskBase } from "../fixtures/task-fixture.js";
import { seedTasks } from "../fixtures/seed-tasks-fixture.js";
const { HomePage } = require("../pom/home.page");

export const test = base.extend({
  ...taskBase,
  ...seedTasks,
});
// These tests mutate shared app state cleared via API, so they must not run in parallel.
test.describe.configure({ mode: "serial" });

test(
  "TC-023:	Edit task - closing modal",
  {
    tag: ["@smoke", "@edit-task", "@TC-023"],
  },
  async ({ page, usernames }) => {
    let home = new HomePage(page);
    const addTask = await home.clickAddTaskForUser(1);
    await addTask.taskNameField.fill(`Test task ${Date.now()}`);
    home = await addTask.clickCloseButton();
    await expect(home.userTaskListEmpty(usernames.user1)).toBeVisible();
    await expect(home.userTaskListEmpty(usernames.user2)).toBeVisible();
  },
);

test(
  "TC-024: Edit task - updating task name",
  {
    tag: ["@smoke", "@edit-task", "@TC-024"],
  },
  async ({ page, usernames, seedTasks }) => {
    const tasks = await seedTasks(1);
    const task = tasks[0];
    await page.reload();
    let home = new HomePage(page);
    const editTask = await home.clickEditTask(1, 1);
    const newTaskName = `Updated task name ${Date.now()}`;
    await editTask.taskNameField.fill(newTaskName);
    home = await editTask.clickSaveButton();
    // verify task name is updated
    await expect(home.getTaskElements(1, 1).text).toHaveText(newTaskName);
  },
);
