// @ts-check

// Fixture: clear all tasks
import { test } from "../fixtures/task-fixture.js";
import { expect } from "@playwright/test";
const { AddTaskPage } = require("../pom/add-task.page.js");
const { HomePage } = require("../pom/home.page");

const MAX_CHAR_TASK_NAME = 140;
const MAX_TASK_REPEAT_COUNT = 30;
const PRIORITY_NAMES = process.env.PRIORITY_NAMES.split(",") || ["1"];

// These tests mutate shared app state cleared via API, so they must not run in parallel.
test.describe.configure({ mode: "serial" });

test("TC-010:	Add task - empty task name not allowed @smoke @add-task @TC-010", async ({ page }) => {
  const home = new HomePage(page);
  const addTask = await home.clickAddTaskForUser(2);
  await addTask.submitButton.click();
  // required attribute, does not pass validation
  await expect(addTask.taskNameField).toHaveAttribute("required");
  const isValid = await addTask.taskNameField.evaluate(
    /** @param {HTMLInputElement} el */
    (el) => el.checkValidity(),
  );
  expect(isValid).toBe(false);
  // add task modal still diplayed
  await expect(addTask.taskNameField).toBeVisible();
});

[1, 2].forEach((userId) => {
  test(`TC-011.${userId}: Add task - valid name with defaults @smoke @add-task @view-list @user${userId} @TC-011`, async ({ page, usernames }) => {
    const taskName = `Test Task ${Date.now()}`;
    let home = new HomePage(page);
    const addTask = await home.clickAddTaskForUser(userId);
    await addTask.taskNameField.fill(taskName);
    home = await addTask.clickAddTaskButton();
    await expect(home.getTaskList(userId)).toHaveCount(1);
    await expect(home.getTaskText(userId, 1)).toHaveText(taskName);
    const otherUsername = userId === 1 ? usernames.user2 : usernames.user1;
    await expect(home.getTaskListEmpty(otherUsername)).toBeVisible();
  });
});

test("TC-012: Add task - task name exceeds max character limit @smoke @add-task @view-list @TC-012", async ({ page }) => {
  const taskName = Date.now() + "A".repeat(MAX_CHAR_TASK_NAME);
  let home = new HomePage(page);
  const addTask = await home.clickAddTaskForUser(1);
  await addTask.taskNameField.fill(taskName);
  // text is truncated to max length on Add Task modal
  await expect(addTask.taskNameField).toHaveValue(taskName.substring(0, MAX_CHAR_TASK_NAME));
  // task displays with truncated value on Home page
  home = await addTask.clickAddTaskButton();
  await expect(home.getTaskText(1, 1)).toHaveText(taskName.substring(0, MAX_CHAR_TASK_NAME));
});

test("TC-013: Add task - task name contains special characters @smoke @add-task @view-list @TC-013", async ({ page }) => {
  // create task
  const specialCharacters = "`~!@#$%^&*()_-+={[}}|\:;\"'<,>.?/" + Date.now();
  let home = new HomePage(page);
  const addTask = await home.clickAddTaskForUser(2);
  await addTask.taskNameField.fill(specialCharacters);
  home = await addTask.clickAddTaskButton();
  // verify task name within task list
  await expect(home.getTaskText(2, 1)).toHaveText(specialCharacters);
});

test("TC-014: Add task - task name contains emojis @smoke @add-task @view-list @TC-014", async ({ page }) => {
  // create task
  const emojis = "🤖🚀👍🧪" + Date.now();
  let home = new HomePage(page);
  const addTask = await home.clickAddTaskForUser(1);
  await addTask.taskNameField.fill(emojis);
  home = await addTask.clickAddTaskButton();
  // verify task name within task list
  await expect(home.getTaskText(1, 1)).toHaveText(emojis);
});

test("TC-015: Add task - non-default owner @smoke @add-task @view-list @TC-015", async ({ page, usernames }) => {
  let home = new HomePage(page);
  const addTask = await home.clickAddTaskForUser(2);
  const taskName = "Test task for User 1, created by User 2 " + Date.now();
  await addTask.taskNameField.fill(taskName);
  await addTask.ownerDropdown.selectOption(usernames.user1);
  home = await addTask.clickAddTaskButton();
  await expect(home.getTaskText(1, 1)).toHaveText(taskName);
  await expect(home.getTaskListEmpty(usernames.user2)).toBeVisible();
});

PRIORITY_NAMES.forEach((priority) => {
  test(`TC-016.${priority}: Add task - non-default priority level @smoke @add-task @view-list @priority @TC-016`, async ({ page }) => {
    let home = new HomePage(page);
    const addTask = await home.clickAddTaskForUser(1);
    const taskName = `Priority: ${priority} - ${Date.now()}`;
    await addTask.taskNameField.fill(taskName);
    await addTask.priorityDropdown.selectOption(priority);
    home = await addTask.clickAddTaskButton();
    await expect(home.getTaskText(1, 1)).toHaveText(taskName);
    await expect(home.getTaskPriority(1, 1)).toHaveText(priority);
  });
});

test("TC-017: Add task - repeat task count @smoke @add-task @view-list @TC-017", async ({ page }) => {
  let home = new HomePage(page);
  const addTask = await home.clickAddTaskForUser(2);
  const taskName = `Repeating task - ${Date.now()}`;
  await addTask.taskNameField.fill(taskName);
  await addTask.repeatTaskCheckbox.check();
  await addTask.reapeatCountRadio.click();
  await addTask.reapeatCountInput.fill("3");
  home = await addTask.clickAddTaskButton();
  await expect(home.getTaskList(2)).toHaveCount(3);
  await expect(home.getTaskText(2, 1)).toHaveText(taskName);
  await expect(home.getTaskText(2, 2)).toHaveText(taskName);
  await expect(home.getTaskText(2, 3)).toHaveText(taskName);
});

test("TC-018: Add task - repeat task count must not exceed maximum @smoke @add-task @TC-018", async ({ page }) => {
  let home = new HomePage(page);
  const addTask = await home.clickAddTaskForUser(1);
  await addTask.taskNameField.fill(`Repeating task exceeds max - ${Date.now()}`);
  await addTask.repeatTaskCheckbox.check();
  await addTask.reapeatCountRadio.click();
  await addTask.reapeatCountInput.fill(String(MAX_TASK_REPEAT_COUNT + 1));
  await addTask.submitButton.click();
  // check field validation
  const isValid = await addTask.reapeatCountInput.evaluate(
    /** @param {HTMLInputElement} el */
    (el) => el.checkValidity(),
  );
  expect(isValid).toBe(false);
  // Add Task Modal is still displayed
  await expect(addTask.taskNameField).toBeVisible();
});
