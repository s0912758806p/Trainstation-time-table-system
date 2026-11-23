import { expect, test, type Page } from '@playwright/test';
import { dateTW, loginAsMember, signIn } from './helpers';

/** 從查詢結果點第一班可訂位列車的「訂票」 */
async function openFirstBookable(page: Page) {
  await page.goto(`/search?from=1000&to=4400&date=${dateTW(3)}`);
  await page.getByRole('link', { name: '訂票', exact: true }).first().click();
}

test.describe('訂票與訂單', () => {
  test('未登入 → 登入 → 訂票 → 付款 → 我的訂單 → 退票', async ({ page }) => {
    await openFirstBookable(page);

    // 未登入會被導到登入頁，登入後回到原本的訂票頁
    await expect(page.getByText('訂票與查看訂單需要先登入會員。')).toBeVisible();
    await loginAsMember(page);
    await expect(page).toHaveURL(/\/booking\?train=\d+/);
    await expect(page.getByRole('heading', { name: '填寫訂票資料' })).toBeVisible();

    // 聯絡人自動帶入會員資料；加一位全票，總計加倍
    await expect(page.getByLabel('電子郵件（寄送電子車票）')).toHaveValue('rider@example.com');
    const total = page.getByRole('complementary', { name: '訂單摘要' }).locator('.price');
    const single = await total.innerText();
    await page.getByRole('button', { name: '增加全票' }).click();
    await expect(page.getByLabel('全票 2 位')).toBeVisible();
    await expect(total).not.toHaveText(single);
    const amount = await total.innerText();

    await page.getByRole('button', { name: '靠窗' }).click();
    await page.getByRole('button', { name: '確認訂票' }).click();

    // 訂位成功頁
    await expect(page).toHaveURL(/\/booking\/done\/TW\d{11}$/);
    await expect(page.getByRole('heading', { name: '訂位成功！' })).toBeVisible();
    await expect(page.getByText(amount)).toBeVisible();
    const orderId = page.url().split('/').pop()!;

    await page.getByRole('button', { name: '立即付款（模擬）' }).click();
    await expect(page.getByRole('heading', { name: '付款完成！' })).toBeVisible();

    // 我的訂單：狀態為已付款，可退票；重新整理後仍保留
    await page.getByRole('link', { name: '查看我的訂單' }).click();
    const detail = page.getByRole('complementary', { name: '訂單詳情' });
    await expect(detail.getByText(orderId)).toBeVisible();
    await expect(detail.getByText('已付款').first()).toBeVisible();
    await page.reload();
    await expect(detail.getByText(orderId)).toBeVisible();

    await detail.getByRole('button', { name: '退票' }).click();
    await expect(detail.getByRole('alertdialog')).toContainText('確定要退票嗎？');
    await detail.getByRole('button', { name: '確定退票' }).click();
    await expect(detail.getByText('已退款').first()).toBeVisible();
  });

  test('訂票表單驗證', async ({ page }) => {
    await signIn(page);
    await openFirstBookable(page);
    await expect(page.getByRole('heading', { name: '填寫訂票資料' })).toBeVisible();

    await page.getByLabel('姓名').fill('');
    await page.getByLabel('手機號碼（選填）').fill('12345');
    await page.getByRole('button', { name: '確認訂票' }).click();
    await expect(page.getByText('請輸入取票人姓名')).toBeVisible();
    await expect(page.getByText('手機號碼格式為 09xx-xxx-xxx')).toBeVisible();
    await expect(page.getByLabel('姓名')).toBeFocused();
    await expect(page).toHaveURL(/\/booking\?/);

    // 乘客減到 0 時無法送出
    await page.getByRole('button', { name: '減少全票' }).click();
    await expect(page.getByRole('button', { name: '確認訂票' })).toBeDisabled();
  });

  test('待付款訂單可在我的訂單取消', async ({ page }) => {
    await signIn(page);
    await openFirstBookable(page);
    await page.getByRole('button', { name: '確認訂票' }).click();
    await expect(page.getByRole('heading', { name: '訂位成功！' })).toBeVisible();

    await page.getByRole('link', { name: '查看我的訂單' }).click();
    const detail = page.getByRole('complementary', { name: '訂單詳情' });
    await expect(detail.getByText('待付款').first()).toBeVisible();
    await detail.getByRole('button', { name: '取消訂單' }).click();
    await detail.getByRole('button', { name: '確定取消' }).click();
    await expect(detail.getByText('已取消').first()).toBeVisible();
  });
});
