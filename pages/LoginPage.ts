import { Page, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class LoginPage extends BasePage {
  private readonly emailInput = '//input[@id="username"]';
  private readonly passwordInput = '//input[@id="password"]';
  private readonly continueButton = '//button[@id="login-submit"]';
  private readonly loginButton = '//button[@id="login-submit"]';

  constructor(page: Page) {
    super(page);
  }

  async login(email: string, apiToken: string) {
    await this.page.fill(this.emailInput, email);
    
    const continueBtn = this.page.locator(this.continueButton).first();
    if (await continueBtn.isVisible().catch(() => false)) {
      await continueBtn.click();
      await this.page.locator(this.passwordInput).waitFor({ state: 'visible' });
    }
    
    await this.page.fill(this.passwordInput, apiToken);
    await this.page.locator(this.loginButton).click();
    await this.page.waitForLoadState('networkidle');
  }

  async isLoggedIn(): Promise<boolean> {
    const currentUrl = this.page.url();
    return currentUrl.includes('/jira/') || currentUrl.includes('/secure/');
  }
}
