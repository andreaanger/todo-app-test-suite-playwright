class EditTaskPage {
  constructor(page) {
    this.page = page;
    /**************************
     **      LOCATORS        **
     **************************/
    this.editTaskHeader = page.getByRole("heading", { name: "Edit Task" });
    this.closeButton = page.getByRole("button", { name: "Close" });
    this.taskNameField = page.getByRole("textbox");
    this.priorityDropdown = page.getByRole("combobox");
    this.deleteButton = page.getByRole("button", { name: "Delete" });
    this.saveButton = page.getByRole("button", { name: "Save" });
  }

  /**************************
   **      ACTIONS         **
   **************************/
  async verifyLoaded() {
    await this.editTaskHeader.waitFor({ state: "visible" });
  }

  async verifyModalClosed() {
    // verify modal closed
    await this.editTaskHeader.waitFor({ state: "hidden" });
    // home page displayed once closed
    const { HomePage } = require("./home.page");
    const home = new HomePage(this.page);
    await home.verifyLoaded();
    return home;
  }

  async clickCloseButton() {
    await this.closeButton.click();
    return this.verifyModalClosed();
  }

  async clickSaveButton() {
    await this.saveButton.click();
    return this.verifyModalClosed();
  }

  async clickDeleteButton() {
    await this.deleteButton.click();
    return this.verifyModalClosed();
  }
}

module.exports = { EditTaskPage };
