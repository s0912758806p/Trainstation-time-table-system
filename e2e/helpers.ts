import { expect, type Page } from '@playwright/test';

/** 臺灣時間的「今天 + days」，格式 YYYY-MM-DD */
export function dateTW(days = 0): string {
  const today = new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Taipei', year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date());
  const d = new Date(`${today}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}

/** 在登入頁以會員身分登入（模擬帳號，任何帳密都可以） */
export async function loginAsMember(page: Page, email = 'rider@example.com') {
  await expect(page).toHaveURL(/\/login/);
  await page.getByLabel('電子郵件').fill(email);
  await page.getByLabel('密碼').fill('password123');
  await page.getByRole('button', { name: '登入', exact: true }).click();
}

/** 直接用網址登入並回到 next（用在不測登入流程本身的情境） */
export async function signIn(page: Page, next = '/') {
  await page.goto(`/login?next=${encodeURIComponent(next)}`);
  await loginAsMember(page);
  await expect(page).not.toHaveURL(/\/login/);
}
