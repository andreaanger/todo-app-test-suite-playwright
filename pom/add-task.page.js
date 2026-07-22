class AddTaskPage {
  constructor(page) {
    this.page = page;
    /**************************
     **      LOCATORS        **
     **************************/
    this.addTaskHeader = page.locator("#taskModalTitle");
    this.taskNameField = page.locator("#todoInput");
    this.ownerDropdown = page.locator("#todoOwner");
    this.submitButton = page.getByRole("button", { name: "Add Task", exact: true });
  }

  /**************************
   **      ACTIONS         **
   **************************/
  async verifyLoaded() {
    await this.addTaskHeader.waitFor({ state: "visible" });
  }

  async clickAddTaskButton(page) {
    // click Add Task button
    await this.submitButton.click();
    // wait for modal to close before interacting with home page
    await this.addTaskHeader.waitFor({ state: "hidden" });
    // load home page
    const { HomePage } = require("./home.page");
    const home = new HomePage(this.page);
    await home.verifyLoaded();
    return home;
  }
}

module.exports = { AddTaskPage };
