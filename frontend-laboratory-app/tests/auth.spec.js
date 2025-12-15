const { test, expect } = require('@playwright/test');

test.describe('Test logowania', () => {
  test('sprawdzamy czy niezalogowany uzytkownik zostanie przeniesiony na strone logowania', async ({ page }) => {
    await page.goto('http://localhost:3000/user/profile');
    await expect(page).toHaveURL(/.*\/user\/signin/);
  });

  test('sprawdzamy czy mozna sie poprawnie zalogowac i przejsc do profilu', async ({ page }) => {
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

  test('sprawdzamy czy pozostajemy na stronie profilu po poprawnym zalogowaniu', async ({ page }) => {
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
