// @ts-check

// Fixture: clear all tasks
import { test } from "../fixtures/task-fixture.js";
import { expect } from "@playwright/test";
const { AddTaskPage } = require("../pom/add-task.page.js");
const { HomePage } = require("../pom/home.page");

const MAX_CHAR_TASK_NAME = 140;

test("TC-010:	Add task - empty task name not allowed @smoke @add-task", async ({ page }) => {
  const home = new HomePage(page);
  const addTask = await home.clickAddTaskForUser(2, home.page);
  await addTask.submitButton.click();
  // required attribute, does not pass validation
  expect(addTask.taskNameField).toHaveAttribute("required");
  const isValid = await addTask.taskNameField.evaluate((el) => el.checkValidity());
  expect(isValid).toBe(false);
  // add task modal still diplayed
  expect(addTask.taskNameField).toBeVisible();
});

test.describe("TC-011 add task defaults", () => {
  test.describe.configure({ mode: "serial" });

  [1, 2].forEach((userId) => {
    test(`TC-011.${userId}: Add task - valid name with defaults @smoke @add-task @user${userId}`, async ({ page, usernames }) => {
      let home = new HomePage(page);
      const addTask = await home.clickAddTaskForUser(userId, home.page);
      await addTask.taskNameField.fill("Test Task");
      home = await addTask.clickAddTaskButton(addTask.page);
      await expect(home.getTaskList(userId)).toHaveCount(1);
      await expect(home.getTaskText(userId, 1)).toHaveText("Test Task");
      const otherUsername = userId === 1 ? usernames.user2 : usernames.user1;
      await expect(home.getTaskListEmpty(otherUsername)).toBeVisible();
    });
  });
});

test("TC-012: Add task - task name exceeds max character limit @smoke @add-task", async ({ page }) => {
  let home = new HomePage(page);
  const addTask = await home.clickAddTaskForUser(1, home.page);
  await addTask.taskNameField.fill("A".repeat(MAX_CHAR_TASK_NAME + 1));
  // text is truncated to max length on Add Task modal
  expect(addTask.taskNameField).toHaveValue("A".repeat(MAX_CHAR_TASK_NAME));
  // task displays with truncated value on Home page
  home = await addTask.clickAddTaskButton(addTask.page);
  await expect(home.userTaskList(1)).toBeVisible();
  expect(home.getTaskText(1, 1)).toHaveText("A".repeat(MAX_CHAR_TASK_NAME));
});

test("TC-013: Add task - non-default owner @smoke @add-task", async ({ page, usernames }) => {
  let home = new HomePage(page);
  const addTask = await home.clickAddTaskForUser(2, home.page);
  const taskName = "Test task for User 1, created by User 2";
  await addTask.taskNameField.fill(taskName);
  await addTask.ownerDropdown.selectOption(usernames.user1);
  home = await addTask.clickAddTaskButton(addTask.page);
  expect(home.getTaskText(1, 1)).toHaveText(taskName);
  expect(home.getTaskListEmpty(usernames.user2)).toBeVisible();
});
