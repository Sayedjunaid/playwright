# Jira Filters Automation

Automation framework for testing Jira filter workflows using Playwright and Page Object Model pattern.

## Project Structure

```
Sifthub/
├── pages/              # Page Object Models
│   ├── BasePage.ts    # Base class with common page methods
│   ├── LoginPage.ts   # Login page interactions
│   └── FilterPage.ts  # Filter page interactions
├── tests/              # Test specifications
│   └── filters.spec.ts
├── config/             # Test configuration
│   └── test.config.ts
└── playwright.config.ts
```

## Page Object Model (POM)

This project uses the Page Object Model design pattern to separate test logic from page-specific code:

- **BasePage**: Contains common methods used across all pages (navigation, waiting)
- **LoginPage**: Handles Jira authentication
- **FilterPage**: Manages all filter-related operations (JQL entry, search, save, validation)

Benefits:
- Better maintainability - UI changes only require updates in page objects
- Reusability - Page objects can be used across multiple tests
- Readability - Tests focus on business logic, not implementation details

## Setup

### 1. Install Dependencies
```bash
npm install
npx playwright install chromium
```

### 2. Configure Environment
Create a `.env` file in the project root:
```
JIRA_BASE_URL=https://your-domain.atlassian.net
JIRA_EMAIL=your-email@example.com
JIRA_API_TOKEN=your-api-token
JIRA_PROJECT_KEY=TEST
```

**Get API Token**: Go to https://id.atlassian.com/manage-profile/security/api-tokens and create a new token.

### 3. Run Tests
```bash
npm test              # Run all tests (headless)
npm run test:headed   # Run with browser visible
npm run test:ui       # Interactive UI mode
npm run test:report   # View test report
```

## Test Coverage

### 1. Open Items Filter
- Creates filter for statuses: Open, To Do, In Progress
- Validates filter creation and save
- Verifies all returned issues have open statuses

### 2. Closed Items Filter
- Creates filter for statuses: Closed, Done, Resolved
- Validates filter creation and save
- Verifies all returned issues have closed statuses

### 3. Empty Results Handling
- Tests behavior when no results are returned
- Validates empty state handling

### 4. JQL Criteria Validation
- Verifies JQL queries match expected issue statuses

## Test Validations

- Filter is created and saved successfully
- JQL criteria match expected open/closed statuses
- Returned issue list contains only correct statuses
- Empty results are handled gracefully

## Configuration

Edit `config/test.config.ts` to customize filter queries and expected statuses:

```typescript
filters: {
  openItems: {
    name: 'Open Items Filter - Automated',
    jql: 'status IN (Open, "To Do", "In Progress") ORDER BY created DESC',
    expectedStatuses: ['open', 'to do', 'in progress'],
  }
}
```
