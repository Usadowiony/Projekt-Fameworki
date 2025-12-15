const { test, expect } = require('@playwright/test');

test.describe('Authentication flow', () => {
  test('should redirect unauthenticated user to login page when accessing profile', async ({ page }) => {
    await page.goto('http://localhost:3000/user/profile');
    await expect(page).toHaveURL(/.*\/user\/signin/);
  });

  test('should login successfully and access profile page', async ({ page }) => {
    await page.goto('http://localhost:3000/user/signin');
    await page.fill('input[type="email"]', 'wojciechpietrzak2003@gmail.com');
    await page.fill('input[type="password"]', 'haslo123');
    await page.click('button[type="submit"]');
    await page.waitForURL('http://localhost:3000/', { timeout: 10000 });
    await page.goto('http://localhost:3000/user/profile');
    await expect(page).toHaveURL('http://localhost:3000/user/profile');
    await expect(page.locator('form')).toBeVisible();
    await expect(page.locator('input[name="displayName"]')).toBeVisible();
  });

  test('should stay on profile page after successful login', async ({ page }) => {
    await page.goto('http://localhost:3000/user/signin');
    await page.fill('input[type="email"]', 'wojciechpietrzak2003@gmail.com');
    await page.fill('input[type="password"]', 'haslo123');
    await page.click('button[type="submit"]');
    await page.waitForURL('http://localhost:3000/', { timeout: 10000 });
    await page.goto('http://localhost:3000/user/profile');
    await page.waitForTimeout(1000);
    await expect(page).toHaveURL('http://localhost:3000/user/profile');
    await expect(page.locator('nav img[alt="Profile"]')).toBeVisible();
  });
});
