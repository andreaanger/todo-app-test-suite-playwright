// @ts-check

// Fixture: clear all tasks
import { test } from "../fixtures/task-fixture.js";
import { expect } from "@playwright/test";
const { AddTaskPage } = require("../pom/add-task.page.js");
const { HomePage } = require("../pom/home.page");

test.describe("TC-010 add task defaults", () => {
  test.describe.configure({ mode: "serial" });

  [1, 2].forEach((userId) => {
    test(`TC-010.${userId}: Add valid task - defaults @smoke @add-task @user${userId}`, async ({ page }) => {
      let home = new HomePage(page);
      const addTask = await home.clickAddTaskForUser(userId, home.page);
      await addTask.taskNameField.fill("Test Task");
      home = await addTask.clickAddTaskButton(addTask.page);
      await expect(home.getTaskList(userId)).toHaveCount(1);
      await expect(home.getTaskText(userId, 1)).toHaveText("Test Task");
      const otherUserId = userId === 1 ? 2 : 1;
      await expect(home.getTaskListEmpty(otherUserId)).toBeVisible();
    });
  });
});
