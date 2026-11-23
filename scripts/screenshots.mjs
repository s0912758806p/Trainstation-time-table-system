/**
 * 重新產生 README 的截圖（docs/screenshots/*.png）。
 *
 *   npm run screenshots
 *
 * 會先 build，再以模擬資料（USE_MOCK=true）在 :3100 啟動正式建置，並把伺服器與瀏覽器的時間
 * 固定在「明天 08:30（臺灣時間）」，讓看板與查詢結果每次截圖都一致。
 * 登入使用模擬帳號（任何帳密都能登入），畫面上不會出現真實個資。
 */
import { spawn, execSync } from 'node:child_process';
import { mkdirSync } from 'node:fs';
import { chromium, devices } from '@playwright/test';

const PORT = 3100;
const BASE = `http://localhost:${PORT}`;
const OUT = 'docs/screenshots';

const tw = (days) => {
  const today = new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Taipei', year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date());
  const d = new Date(`${today}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
};
const DAY = tw(1);
const NOW = `${DAY}T08:30:00+08:00`;
const TRIP = `date=${tw(3)}&from=1000&to=4400`;

async function waitForServer() {
  for (let i = 0; i < 120; i++) {
    try {
      if ((await fetch(BASE)).ok) return;
    } catch { /* 還沒起來 */ }
    await new Promise((r) => setTimeout(r, 500));
  }
  throw new Error('server did not start');
}

async function main() {
  if (!process.argv.includes('--no-build')) execSync('npm run build', { stdio: 'inherit' });
  mkdirSync(OUT, { recursive: true });

  const server = spawn('npx', ['next', 'start', '-p', String(PORT)], {
    env: { ...process.env, USE_MOCK: 'true', FAKE_NOW: NOW, NODE_OPTIONS: '--import ./scripts/fake-clock.mjs' },
    stdio: 'ignore',
  });
  try {
    await waitForServer();
    const browser = await chromium.launch();
    const context = async (opts, theme = 'light') => {
      const ctx = await browser.newContext({ locale: 'zh-TW', timezoneId: 'Asia/Taipei', ...opts });
      await ctx.addInitScript((t) => localStorage.setItem('ts.theme', t), theme);
      return ctx;
    };
    const open = async (ctx, path) => {
      const page = await ctx.newPage();
      await page.clock.setFixedTime(new Date(NOW));
      await page.goto(BASE + path);
      await page.waitForLoadState('networkidle');
      return page;
    };
    const shot = (page, name, fullPage = false) => page.screenshot({ path: `${OUT}/${name}.png`, fullPage });

    // 桌面版（未登入）
    const desktop = await context({ viewport: { width: 1440, height: 900 } });
    await shot(await open(desktop, '/'), 'home');
    await shot(await open(desktop, `/search?from=1000&to=4400&date=${DAY}`), 'search');
    await shot(await open(desktop, `/trains/101?${TRIP}`), 'train');
    await shot(await open(desktop, '/stations/1000'), 'station');
    await shot(await open(desktop, '/help'), 'help');

    // 登入（模擬帳號）→ 訂票 → 完成 → 我的訂單
    const login = await open(desktop, `/login?next=${encodeURIComponent(`/booking?train=101&${TRIP}`)}`);
    await shot(login, 'login');
    await login.getByLabel('電子郵件').fill('demo@example.com');
    await login.getByLabel('密碼').fill('demo-password');
    await login.getByRole('button', { name: '登入', exact: true }).click();
    await login.getByRole('heading', { name: '填寫訂票資料' }).waitFor();
    await login.getByLabel('姓名').fill('示範旅客');
    await login.getByRole('button', { name: '增加全票' }).click();
    await login.getByRole('button', { name: '靠窗' }).click();
    await shot(login, 'booking');
    await login.getByRole('button', { name: '確認訂票' }).click();
    await login.getByRole('heading', { name: '訂位成功！' }).waitFor();
    await shot(login, 'booking-done');
    await login.getByRole('link', { name: '查看我的訂單' }).click();
    await login.getByRole('heading', { name: '我的訂單' }).waitFor();
    await shot(login, 'orders');

    // 深色模式
    const dark = await context({ viewport: { width: 1440, height: 900 } }, 'dark');
    await shot(await open(dark, `/search?from=1000&to=4400&date=${DAY}`), 'search-dark');

    // 手機版
    const mobile = await context({ ...devices['iPhone 13'] });
    await shot(await open(mobile, '/'), 'mobile-home');
    await shot(await open(mobile, `/search?from=1000&to=4400&date=${DAY}`), 'mobile-search');
    await shot(await open(mobile, `/trains/101?${TRIP}`), 'mobile-train');

    await browser.close();
    console.log(`screenshots saved to ${OUT}/`);
  } finally {
    server.kill();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
