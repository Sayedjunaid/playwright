import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { FilterPage } from '../pages/FilterPage';
import { TEST_CONFIG } from '../config/test.config';

test.describe('Jira Filters Workflow', () => {
  let loginPage: LoginPage;
  let filterPage: FilterPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    filterPage = new FilterPage(page);

    await page.goto(TEST_CONFIG.jira.baseUrl);
    await loginPage.login(TEST_CONFIG.jira.email, TEST_CONFIG.jira.apiToken);
    
    const isLoggedIn = await loginPage.isLoggedIn();
    expect(isLoggedIn).toBeTruthy();
  });

  test('Create and validate Open Items filter', async () => {
    const { openItems } = TEST_CONFIG.filters;

    await filterPage.navigateToAdvancedSearch();
    await filterPage.enterJQL(openItems.jql);
    await filterPage.clickSearch();
    await filterPage.saveFilter(openItems.name);

    const isSaved = await filterPage.verifyFilterSaved(openItems.name);
    expect(isSaved).toBeTruthy();

    const issueCount = await filterPage.getIssueCount();
    console.log(`Open Items Filter returned ${issueCount} issues`);

    if (issueCount > 0) {
      const statuses = await filterPage.getIssueStatuses();
      console.log('Found statuses:', statuses);

      statuses.forEach(status => {
        const isOpenStatus = openItems.expectedStatuses.some(
          expectedStatus => status.includes(expectedStatus)
        );
        expect(isOpenStatus).toBeTruthy();
      });
    } else {
      console.log('No open items found - valid if all issues are closed');
    }
  });

  test('Create and validate Closed/Done Items filter', async () => {
    const { closedItems } = TEST_CONFIG.filters;

    await filterPage.navigateToAdvancedSearch();
    await filterPage.enterJQL(closedItems.jql);
    await filterPage.clickSearch();
    await filterPage.saveFilter(closedItems.name);

    const isSaved = await filterPage.verifyFilterSaved(closedItems.name);
    expect(isSaved).toBeTruthy();

    const issueCount = await filterPage.getIssueCount();
    console.log(`Closed Items Filter returned ${issueCount} issues`);

    if (issueCount > 0) {
      const statuses = await filterPage.getIssueStatuses();
      console.log('Found statuses:', statuses);

      statuses.forEach(status => {
        const isClosedStatus = closedItems.expectedStatuses.some(
          expectedStatus => status.includes(expectedStatus)
        );
        expect(isClosedStatus).toBeTruthy();
      });
    } else {
      console.log('No closed items found - valid if no issues completed yet');
    }
  });

  test('Validate behavior when filter returns no results', async () => {
    const noResultsJQL = 'project = "NONEXISTENT12345" AND status = "Impossible Status"';

    await filterPage.searchWithJQL(noResultsJQL);

    const issueCount = await filterPage.getIssueCount();
    expect(issueCount).toBe(0);

    const hasNoResults = await filterPage.hasNoResults();
    console.log('Empty results handled correctly:', hasNoResults || issueCount === 0);
  });

  test('Verify JQL criteria match expected statuses', async () => {
    const { openItems } = TEST_CONFIG.filters;

    await filterPage.searchWithJQL(openItems.jql);
    const statuses = await filterPage.getIssueStatuses();

    if (statuses.length > 0) {
      statuses.forEach(status => {
        const matchesExpected = openItems.expectedStatuses.some(
          expected => status.includes(expected)
        );
        expect(matchesExpected).toBeTruthy();
      });
      console.log('All returned statuses match JQL criteria');
    } else {
      console.log('No issues found - test passes with empty results');
    }
  });
});
