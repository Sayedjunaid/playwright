import { Page, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class FilterPage extends BasePage {
  private readonly filtersUrl = '/issues/?filter=-1';
  private readonly advancedSearchUrl = '/issues/?jql=';
  private readonly filterUrlIndicator = 'filter=';

  private readonly filtersMenu = '//div[@data-test-id="navigation-apps-sidebar-next-gen.ui.menu.filters"]';
  private readonly advancedSearchLink = '//a[contains(text(), "Advanced issue search") or contains(text(), "View all issues")]';
  private readonly jqlEditor = '//textarea[@name="jql"] | //input[@data-test-id="jql-editor-input"] | //textarea[@id="advanced-search"]';
  private readonly searchButton = '//button[contains(text(), "Search")] | //button[@aria-label="Search"]';
  private readonly saveAsButton = '//button[contains(text(), "Save as")] | //button[@aria-label="Save as"]';
  private readonly filterNameInput = '//input[@id="filter-title"] | //input[@name="filterName"] | //input[@data-testid="filter-name-input"]';
  private readonly submitFilterButton = '//button[contains(text(), "Submit") or contains(text(), "Save")]';
  private readonly issueRows = '//div[@data-testid="issue.views.issue-base.foundation.issue-line-card"] | //tr[@data-issue-key] | //div[contains(@class, "issue-row")]';
  private readonly issueStatusBadge = '//span[@data-testid="issue.views.field.status.common.ui.status-lozenge"] | //span[contains(@class, "status")]';
  private readonly noResultsMessage = '//div[contains(text(), "no issues") or contains(text(), "no results") or contains(text(), "no matches")]';
  private readonly loadingSpinner = '//div[@data-testid="issue-table-loading"] | //div[contains(@class, "loading-spinner")] | //*[@aria-label="Loading"]';

  constructor(page: Page) {
    super(page);
  }

  async navigateToFilters() {
    await this.page.goto(this.filtersUrl);
    await this.waitForPageLoad();
  }

  async navigateToAdvancedSearch() {
    await this.page.goto(this.advancedSearchUrl);
    await this.waitForPageLoad();
  }

  async enterJQL(jqlQuery: string) {
    const jqlEditorLocator = this.page.locator(this.jqlEditor).first();
    await jqlEditorLocator.waitFor({ state: 'visible' });
    await jqlEditorLocator.clear();
    await jqlEditorLocator.fill(jqlQuery);
  }

  async clickSearch() {
    const searchBtn = this.page.locator(this.searchButton).first();
    await searchBtn.click();
    await this.waitForPageLoad();
  }

  async saveFilter(filterName: string) {
    const saveBtn = this.page.locator(this.saveAsButton).first();
    await saveBtn.waitFor({ state: 'visible' });
    await saveBtn.click();
    
    const nameInput = this.page.locator(this.filterNameInput).first();
    await nameInput.waitFor({ state: 'visible' });
    await nameInput.fill(filterName);
    
    const submitBtn = this.page.locator(this.submitFilterButton).first();
    await submitBtn.click();
    await this.waitForPageLoad();
  }

  async getIssueCount(): Promise<number> {
    const noResults = this.page.locator(this.noResultsMessage);
    if (await noResults.isVisible().catch(() => false)) {
      return 0;
    }
    const loadingSpinner = this.page.locator(this.loadingSpinner);
    await loadingSpinner.waitFor({ state: 'hidden' }).catch(() => {});
    const issues = this.page.locator(this.issueRows);
    await issues.first().waitFor({ state: 'visible' }).catch(() => {});
    return await issues.count();
  }

  async getIssueStatuses(): Promise<string[]> {
    const statuses: string[] = [];
    const noResults = this.page.locator(this.noResultsMessage);
    if (await noResults.isVisible().catch(() => false)) {
      return statuses;
    }
    const loadingSpinner = this.page.locator(this.loadingSpinner);
    await loadingSpinner.waitFor({ state: 'hidden' }).catch(() => {});
    const statusBadges = this.page.locator(this.issueStatusBadge);
    await statusBadges.first().waitFor({ state: 'visible' }).catch(() => {});
    const count = await statusBadges.count();
    for (let i = 0; i < count; i++) {
      const statusText = await statusBadges.nth(i).textContent();
      if (statusText) {
        statuses.push(statusText.trim().toLowerCase());
      }
    }
    return statuses;
  }

  async verifyFilterSaved(filterName: string): Promise<boolean> {
    const url = this.page.url();
    const pageContent = await this.page.content();
    return url.includes(this.filterUrlIndicator) || pageContent.toLowerCase().includes(filterName.toLowerCase());
  }

  async createAndSaveFilter(jqlQuery: string, filterName: string) {
    await this.navigateToAdvancedSearch();
    await this.enterJQL(jqlQuery);
    await this.clickSearch();
    await this.saveFilter(filterName);
  }

  async searchWithJQL(jqlQuery: string) {
    await this.navigateToAdvancedSearch();
    await this.enterJQL(jqlQuery);
    await this.clickSearch();
  }

  hasNoResults(): Promise<boolean> {
    return this.page.locator(this.noResultsMessage).isVisible().catch(() => false);
  }
}
