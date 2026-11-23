import { expect, test } from '@playwright/test';

test.describe('查詢班次', () => {
  test('從首頁依起訖站查詢', async ({ page }) => {
    await page.goto('/');
    const form = page.getByRole('form', { name: '查詢班次' });

    await form.getByRole('button', { name: /^出發站：/ }).click();
    const dialog = page.getByRole('dialog', { name: '選擇出發站' });
    await dialog.getByLabel('搜尋車站').fill('台中'); // 「台」應自動視為「臺」
    await dialog.getByRole('button', { name: /^臺中/ }).click();
    await expect(dialog).toBeHidden();
    await expect(form.getByRole('button', { name: '出發站：臺中' })).toBeVisible();

    await form.getByRole('button', { name: /^明天/ }).click();
    await form.getByRole('button', { name: '查詢班次' }).click();

    await expect(page).toHaveURL(/\/search\?from=3300&to=4400&date=\d{4}-\d{2}-\d{2}/);
    await expect(page.getByRole('link', { name: '停靠站與詳情' }).first()).toBeVisible();
  });

  test('起訖站相同時顯示錯誤', async ({ page }) => {
    await page.goto('/');
    const form = page.getByRole('form', { name: '查詢班次' });
    await form.getByRole('button', { name: /^抵達站：/ }).click();
    await page.getByRole('dialog').getByLabel('搜尋車站').fill('臺北');
    await page.getByRole('dialog').getByRole('button', { name: /^臺北/ }).click();
    await form.getByRole('button', { name: '查詢班次' }).click();
    await expect(form.getByRole('alert')).toHaveText('出發站與抵達站不能相同');
    await expect(page).toHaveURL('/');
  });

  test('交換起訖站', async ({ page }) => {
    await page.goto('/');
    const form = page.getByRole('form', { name: '查詢班次' });
    await expect(form.getByRole('button', { name: '出發站：臺北' })).toBeVisible();
    await form.getByRole('button', { name: '交換出發站與抵達站' }).click();
    await expect(form.getByRole('button', { name: '出發站：高雄' })).toBeVisible();
    await expect(form.getByRole('button', { name: '抵達站：臺北' })).toBeVisible();
  });

  test('依車次查詢並驗證格式', async ({ page }) => {
    await page.goto('/');
    const form = page.getByRole('form', { name: '查詢班次' });
    await form.getByRole('button', { name: '依車次' }).click();

    await form.getByLabel('車次號碼').fill('abc');
    await form.getByRole('button', { name: '查詢車次' }).click();
    await expect(form.getByRole('alert')).toHaveText('請輸入 1–4 位數的車次號碼');

    await form.getByLabel('車次號碼').fill('101');
    await form.getByRole('button', { name: '查詢車次' }).click();
    await expect(page).toHaveURL(/\/trains\/101\?date=/);
    await expect(page.getByText('七堵').first()).toBeVisible();
    await expect(page.getByText('屏東').first()).toBeVisible();
  });

  test('查詢結果可進入車次詳情', async ({ page }) => {
    await page.goto('/search?from=1000&to=4400');
    await page.getByRole('link', { name: '停靠站與詳情' }).first().click();
    await expect(page).toHaveURL(/\/trains\/\d+\?date=.*from=1000&to=4400/);
    await expect(page.getByText('臺北').first()).toBeVisible();
    await expect(page.getByText('高雄').first()).toBeVisible();
  });
});
