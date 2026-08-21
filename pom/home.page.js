const { AddTaskPage } = require("./add-task.page.js");
const { EditTaskPage } = require("./edit-task.page.js");

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
    // general elements
    this.userTaskListContainer = (userId) => page.getByTestId(`user-${userId}-task-list`); // container for user tasks
    this.userTaskListItems = (userId) => this.userTaskListContainer(userId).getByRole("listitem"); // all tasks for user
    this.userTaskListEmpty = (username) => page.locator(`text=/No tasks for ${username} yet\./`); // user empty state
    // elements inside specified task
    this.taskCheckbox = (task) => task.getByRole("checkbox");
    this.taskText = (task) => task.locator(".todo-text");
    this.taskPriority = (task) => task.locator(".todo-category");
    this.taskEditButton = (task) => task.getByRole("button");
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

  async clickEditTask(userId, taskNumber) {
    // click button
    await this.getTaskElements(userId, taskNumber).editButton.click();
    // load new page
    const editTask = new EditTaskPage(this.page);
    await editTask.verifyLoaded();
    return editTask;
  }

  /**************************
   **      HELPER          **
   **************************/

  getTask(userId, taskNumber) {
    const taskItems = this.userTaskListItems(userId);
    return taskItems.nth(taskNumber - 1); // -1 since 0-based;
  }

  getTaskElements(userId, taskNumber) {
    const task = this.getTask(userId, taskNumber);
    return {
      checkbox: this.taskCheckbox(task),
      text: this.taskText(task),
      priority: this.taskPriority(task),
      editButton: this.taskEditButton(task),
    };
  }
}

module.exports = { HomePage };
