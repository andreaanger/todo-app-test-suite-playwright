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

let task;

test.beforeEach(async ({ page, seedTasks }) => {
  // create a task via the API
  const tasks = await seedTasks(1);
  task = tasks[0];
  // refresh page to display task in UI
  await page.reload();
});

test(
  "TC-023:	Edit task - closing modal",
  {
    tag: ["@edit-task", "@TC-023"],
  },
  async ({ page, usernames }) => {
    let home = new HomePage(page);
    const editTask = await home.clickEditTask(1, 1);
    home = await editTask.clickCloseButton();
    await expect(home.getTaskElements(1, 1).text).toHaveText(task.title);
  },
);

test(
  "TC-024: Edit task - updating task name",
  {
    tag: ["@smoke", "@edit-task", "@TC-024"],
  },
  async ({ page }) => {
    let home = new HomePage(page);
    const editTask = await home.clickEditTask(1, 1);
    const newTaskName = `Updated task name ${Date.now()}`;
    await editTask.taskNameField.fill(newTaskName);
    home = await editTask.clickSaveButton();
    // verify task name is updated
    await expect(home.getTaskElements(1, 1).text).toHaveText(newTaskName);
  },
);

test(
  "TC-025: Edit task - updating priority",
  {
    tag: ["@smoke", "@edit-task", "@TC-025"],
  },
  async ({ page }) => {
    const targetPriority = process.env.PRIORITY_NAMES.split(",")[3]; //P4
    let home = new HomePage(page);
    const editTask = await home.clickEditTask(1, 1);
    await editTask.priorityDropdown.selectOption(targetPriority);
    home = await editTask.clickSaveButton();
    // verify priority is updated
    await expect(home.getTaskElements(1, 1).priority).toHaveText(targetPriority);
  },
);

test(
  "TC-026: Edit task - deleting task",
  {
    tag: ["@smoke", "@edit-task", "@TC-026"],
  },
  async ({ page, usernames }) => {
    let home = new HomePage(page);
    const editTask = await home.clickEditTask(1, 1);
    home = await editTask.clickDeleteButton();
    await expect(home.userTaskListEmpty(usernames.user1));
  },
);

test(
  "TC-027: Edit task - new ask name exceeds max character limit",
  {
    tags: ["@edit-task", "@TC-027"],
  },
  async ({ page }) => {
    let home = new HomePage(page);
    const editTask = await home.clickEditTask(1, 1);
    const maxCharacter = parseInt(process.env.MAX_CHAR_TASK_NAME);
    const taskName = Date.now() + "A".repeat(maxCharacter);
    await editTask.taskNameField.fill(taskName);
    home = await editTask.clickSaveButton();
    // verify edited task name is truncated to max character limit
    await expect(home.getTaskElements(1, 1).text).toHaveText(taskName.substring(0, maxCharacter));
  },
);
