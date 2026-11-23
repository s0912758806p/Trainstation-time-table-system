/**
 * 端對端測試（Playwright）：對正式建置（next start）跑真實瀏覽器。
 * - 一律用模擬資料（USE_MOCK=true），結果不受 TDX 或本機 .env.local 影響。
 * - 本機執行會先 build；CI 已在前一步 build 過，直接 start。
 * - 時區固定為 Asia/Taipei，與網站計算「今天」的方式一致。
 */
import { defineConfig, devices } from '@playwright/test';

const PORT = 3100;
const CI = !!process.env.CI;

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: CI,
  retries: CI ? 1 : 0,
  reporter: CI ? [['github'], ['html', { open: 'never' }]] : [['list']],
  use: {
    baseURL: `http://localhost:${PORT}`,
    locale: 'zh-TW',
    timezoneId: 'Asia/Taipei',
    trace: 'retain-on-failure',
  },
  projects: [
    { name: 'desktop', use: { ...devices['Desktop Chrome'] }, testIgnore: /\.mobile\.spec\.ts$/ },
    { name: 'mobile', use: { ...devices['Pixel 7'] }, testMatch: /\.mobile\.spec\.ts$/ },
  ],
  webServer: {
    command: CI ? `npm start -- -p ${PORT}` : `npm run build && npm start -- -p ${PORT}`,
    url: `http://localhost:${PORT}`,
    env: { USE_MOCK: 'true' },
    reuseExistingServer: !CI,
    timeout: 240_000,
  },
});
