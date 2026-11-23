import { expect, test } from '@playwright/test';

test.describe('手機版版面', () => {
  for (const path of ['/', '/search?from=1000&to=4400', '/stations/1000', '/help', '/login']) {
    test(`${path} 沒有水平捲動`, async ({ page }) => {
      await page.goto(path);
      await page.waitForLoadState('networkidle');
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
      expect(overflow).toBeLessThanOrEqual(0);
    });
  }

  test('底部分頁列可導覽，桌面選單隱藏', async ({ page }) => {
    await page.goto('/');
    const navs = page.getByRole('navigation', { name: '主選單' });
    const tabbar = navs.locator('visible=true');
    await expect(tabbar).toHaveCount(1);
    await expect(tabbar).toHaveClass(/tabbar/);
    await expect(tabbar.getByRole('link', { name: '首頁' })).toHaveAttribute('aria-current', 'page');
    await tabbar.getByRole('link', { name: '時刻' }).click();
    await expect(page).toHaveURL(/\/search/);
    await expect(tabbar.getByRole('link', { name: '時刻' })).toHaveAttribute('aria-current', 'page');
  });
});
