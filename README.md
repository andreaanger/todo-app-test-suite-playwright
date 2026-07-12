# To-Do App - Playwright Automation Test Suite

Playwright end-to-end test suite for a to-do list application. The repository demonstrates a practical test automation setup with Page Object Model structure, environment-based configuration, and cross-browser execution.

### CI/CD Workflow Architecture

The smoke test execution is completely automated via GitHub Actions using the following cross-repository workflow:

1. **Developer Action**  
   *`Application Repository`*  
   A developer opens or updates a Pull Request (PR) in the core application repository.

2. **Cross-Repo Dispatch**  
   *`GitHub Actions`*  
   The application pipeline fires a `repository_dispatch` event targeted at this test automation repository.

3. **Test Execution**  
   *`Test Automation Repository`*  
   The test repository receives the event webhook and instantly triggers the smoke test suite against the PR build.



## Project Features

- End-to-end UI testing with Playwright
- Page Object Model design in the `pom/` directory
- Environment-driven configuration through `stage.env` (local) and repository secrets (stage)
- Cross-browser test execution across Chromium, Firefox, and WebKit
- HTML test reporting for review and debugging
- CI/CD pipeline integration, see `.github/workflows/run-smoke-tests.yml`

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
