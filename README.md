# To-Do App - Playwright Automation Test Suite

Playwright end-to-end test suite for a to-do list application. The repository demonstrates a practical test automation setup with Page Object Model structure, environment-based configuration, cross-browser execution, Allure reporting, and GitHub Copilot-assisted troubleshooting.

### CI/CD Workflow Architecture

Test execution is automated via GitHub Actions through two CI/CD scenarios:

#### 1) PR Validation (Cross-Repository Smoke Tests)

1. **Developer Action**  
   _`Application Repository`_  
   A developer opens or updates a Pull Request (PR) in the core application repository.

2. **Cross-Repo Dispatch**  
   _`GitHub Actions`_  
   The application pipeline fires a `repository_dispatch` event targeted at this test automation repository.

3. **Smoke Test Execution**  
   _`Test Automation Repository`_  
   The test repository receives the event webhook and triggers the smoke test suite against the PR build.

#### 2) Post-Merge Stage Validation + Published Reports

1. **Merge to Main**  
   _`Application Repository` or `Test Automation Repository`_  
   New code is merged into the `main` branch in either repository.

2. **Stage Test Execution**  
   _`Test Automation Repository`_  
   A GitHub Actions workflow runs the Playwright test suite against the stage environment.

3. **Report Publication**  
   _`GitHub Pages`_  
   The workflow publishes the Allure test results report automatically to: https://andreaanger.github.io/todo-app-test-suite-playwright/

## Project Features

- End-to-end UI testing with Playwright
- Page Object Model design in the `pom/` directory
- Environment-driven configuration through `stage.env` (local) and repository secrets (stage)
- Cross-browser test execution across Chromium and WebKit
- HTML test reporting for review and debugging
- Allure test report automatically published to site: https://andreaanger.github.io/todo-app-test-suite-playwright/
- CI/CD pipeline integration for PR smoke tests and post-merge stage validation with automatic GitHub Pages report publishing

## Project Structure

- `tests/` - Playwright test specs
- `pom/` - Page object classes
- `playwright.config.js` - Playwright configuration and browser setup
- `stage.env` - Environment variables used by the tests
- `playwright-report/` - Generated HTML report output

## Prerequisites

- Node.js 18 or later
- npm

## Setup

1. Install dependencies:

```bash
npm install
```

2. Install Playwright browsers:

```bash
npx playwright install
```

3. Confirm `stage.env` contains the values your tests need. At minimum, this project expects:

```bash
APP_URL=
APP_TITLE=
```

## Running Tests

Run the full suite:

```bash
npx playwright test
```

Run a single test file:

```bash
npx playwright test tests/home-header-nav.test.js
```

Run tests by tag:

```bash
npx playwright test --grep @smoke
```

Run a single browser project:

```bash
npx playwright test --project=chromium
```

Open the HTML report after a run:

```bash
npx playwright show-report
```
