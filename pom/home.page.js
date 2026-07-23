const { AddTaskPage } = require("./add-task.page.js");

class HomePage {
  constructor(page) {
    this.page = page;

    /**************************
     **      LOCATORS        **
     **************************/
    // TITLE
    this.title = page.getByTestId("title");

    // WEEK
    this.weekLabel = page.locator("#weekLabel");
    this.previousWeekButton = page.locator("#prevWeek");
    this.currentWeekButton = page.locator("#currentWeek");
    this.nextWeekButton = page.locator("#nextWeek");

    // + TASK
    this.userAddTaskButton = (userId) => page.getByTestId(`user-${userId}-add-task-button`);

    // TASK LIST
    this.userTaskList = (userId) => page.getByTestId(`user-${userId}-task-list`);
    this.userTaskListEmpty = (username) => page.locator(`text=/No tasks for ${username} yet\./`);
  }

  /**************************
   **      ACTIONS         **
   **************************/
  async navigate() {
    await this.page.goto(process.env.APP_URL);
  }

  async verifyLoaded() {
    await this.title.waitFor({ state: "visible" });
  }

  async clickAddTaskForUser(userId) {
    //click + button for given user
    await this.userAddTaskButton(userId).click();
    // load new page
    const addTask = new AddTaskPage(this.page);
    await addTask.verifyLoaded();
    return addTask;
  }

  getTaskList(userId) {
    return this.userTaskList(userId).locator("li");
  }

  getTaskText(userId, taskNumber) {
    return this.userTaskList(userId)
      .locator("li")
      .locator(".todo-text")
      .nth(taskNumber - 1); // -1 since 0-based
  }

  getTaskListEmpty(username) {
    return this.userTaskListEmpty(username);
  }
}

module.exports = { HomePage };
