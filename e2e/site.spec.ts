import { expect, test } from '@playwright/test';

test.describe('登入保護', () => {
  test('未登入開啟我的訂單會導向登入頁並帶 next', async ({ page }) => {
    await page.goto('/orders');
    await expect(page).toHaveURL('/login?next=%2Forders');
    await expect(page.getByText('訂票與查看訂單需要先登入會員。')).toBeVisible();
  });

  test('訪客不會在受保護頁與登入頁之間循環', async ({ page }) => {
    await page.goto('/login?next=%2Forders');
    await page.getByRole('button', { name: '以訪客身分瀏覽' }).click();
    await expect(page).toHaveURL('/');
    await page.goto('/orders');
    await expect(page).toHaveURL(/\/login\?next=%2Forders/);
  });

  test('登入表單驗證', async ({ page }) => {
    await page.goto('/login');
    const form = page.locator('form'); // Next 的 route announcer 也是 role=alert，需限定在表單內
    await page.getByLabel('電子郵件').fill('not-an-email');
    await page.getByRole('button', { name: '登入', exact: true }).click();
    await expect(form.getByRole('alert')).toHaveText('請輸入有效的電子郵件');
    await page.getByLabel('電子郵件').fill('a@b.co');
    await page.getByLabel('密碼').fill('short');
    await page.getByRole('button', { name: '登入', exact: true }).click();
    await expect(form.getByRole('alert')).toHaveText('密碼至少需要 8 個字元');
  });
});

test.describe('其他頁面', () => {
  test('深色模式切換後重新整理仍保留', async ({ page }) => {
    await page.goto('/');
    const html = page.locator('html');
    await expect(html).not.toHaveAttribute('data-theme', 'dark');
    await page.getByRole('button', { name: '切換為深色模式' }).first().click();
    await expect(html).toHaveAttribute('data-theme', 'dark');
    await page.reload();
    await expect(html).toHaveAttribute('data-theme', 'dark');
    await expect(page.getByRole('button', { name: '切換為亮色模式' }).first()).toBeVisible();
  });

  test('車站頁顯示兩個方向的發車看板', async ({ page }) => {
    await page.goto('/stations/1000');
    await expect(page.getByRole('heading', { name: /臺北/ }).first()).toBeVisible();
    const tabs = page.getByRole('button', { name: /^(往|順行|逆行)/ });
    await expect(tabs).toHaveCount(2);
  });

  test('幫助中心全文搜尋', async ({ page }) => {
    await page.goto('/help');
    await page.getByRole('searchbox').fill('退票');
    await expect(page.getByRole('heading', { name: '「退票」的搜尋結果' })).toBeVisible();
    await expect(page.getByRole('region', { name: '常見問題' }).locator('summary').first()).toBeVisible();
  });

  test('網址不存在時回傳 404', async ({ page }) => {
    const res = await page.goto('/no-such-page');
    expect(res?.status()).toBe(404);
    await expect(page.getByRole('heading', { name: '這個月台沒有列車' })).toBeVisible();
  });

  test('無效車次顯示找不到頁面且不被搜尋引擎收錄', async ({ page }) => {
    // (site)/loading.tsx 讓頁面先串流，notFound() 時狀態碼已送出 200（Next.js 的既定行為），
    // Next 會改加 noindex；這裡驗證畫面與 noindex，而不是狀態碼。
    await page.goto('/trains/abc');
    await expect(page.getByRole('heading', { name: '這個月台沒有列車' })).toBeVisible();
    await expect(page.locator('meta[name="robots"][content*="noindex"]').first()).toBeAttached();
  });
});
