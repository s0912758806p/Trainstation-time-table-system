# 台鐵列車時刻查詢系統

使用台灣鐵路管理局公開 API 的列車時刻查詢系統，提供即時列車資訊與簡易的查詢介面。

## 功能特色

- 查詢特定日期的列車時刻表
- 根據車次號碼搜尋特定列車
- 以出發站與抵達站查詢列車
- 查看車票與預訂資訊
- 使用者驗證與授權機制
- 完全響應式設計，支援各種裝置

## 技術堆疊

- React 18.3
- TypeScript
- Vite 6.0
- Redux Toolkit - 狀態管理
- Ant Design - UI 元件庫
- Axios - API 請求處理
- React Router v7 - 路由管理
- JSSHA - API 身份驗證

## 快速開始

### 前置需求

- Node.js 18+
- npm 9+
- PTX 平台 API 金鑰

### 環境設定

複製 `.env.example` 到 `.env` 並設定您的 PTX API 金鑰：

```
VITE_API_URL=https://ptx.transportdata.tw/MOTC/v2
VITE_PTX_APP_ID=您的APP_ID
VITE_PTX_APP_KEY=您的APP_KEY
```

### 開發與建置

```bash
# 安裝依賴
npm install

# 啟動開發伺服器
npm run dev

# 生產環境建置
npm run build

# 預覽建置結果
npm run preview
```

## 專案架構

```
src/
├── api/                # API 服務與資料處理
│   ├── client.ts       # API 客戶端與請求處理
│   ├── auth.ts         # 認證相關 API
│   ├── train.ts        # 台鐵 API 服務
│   └── index.ts        # API 模組入口
├── assets/             # 靜態資源
│   └── styles/         # SCSS 樣式檔案
├── components/         # 可重用元件
│   ├── ButtonComp/     # 按鈕元件
│   ├── InputComp/      # 輸入框元件
│   ├── TrainCardComp/  # 列車卡片元件
│   └── ...
├── pages/              # 應用頁面
│   ├── TrainLoginPage.tsx      # 登入頁面
│   ├── TrainSchedulePage.tsx   # 時刻表頁面
│   ├── TrainDetailsPage.tsx    # 列車詳情頁面
│   └── TicketQueryPage.tsx     # 車票查詢頁面
├── routes/             # 路由設定
├── store/              # Redux 狀態管理
│   ├── authSlice.ts    # 認證狀態管理
│   └── index.ts        # Store 配置
└── utils/              # 工具函數
    └── authStorage.ts  # 認證儲存工具
```

## API 架構

本專案採用模組化的 API 架構，將不同功能區分為獨立模組：

- **client.ts**: 處理 API 請求的核心模組，包含請求處理、認證與錯誤處理
- **train.ts**: 包含所有台鐵 API 相關功能，如查詢列車、站點資訊等
- **auth.ts**: 處理使用者認證相關 API，包括登入、登出與令牌刷新
- **index.ts**: API 模組的統一入口點，導出所有 API 功能

### 使用示例

```typescript
// 引入 API 功能
import { getAllStations, getTrainByNumber } from '../api/train';
import { loginApi } from '../api/auth';

// 使用 API
const stations = await getAllStations();
const trainDetails = await getTrainByNumber('123', '2023-04-01');
```

## 授權

本專案使用 MIT 授權。

## 作者

Geng Yu aka s0912758806p
