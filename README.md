# 台鐵列車時刻查詢系統

使用模擬數據提供的台灣鐵路列車時刻查詢系統，呈現完整的列車資訊與直觀的查詢介面。
展示網站[DEMO](https://trainstation-time-table-gr925.vercel.app)

## 功能特色

- 查詢特定日期的列車時刻表
- 根據車次號碼搜尋特定列車
- 以出發站與抵達站查詢列車
- 查看車票與預訂資訊
- 用戶訂單管理系統
- 會員中心與個人資料管理
- 完整的常見問題與幫助中心
- 使用者驗證與授權機制
- 固定側欄導航，提升用戶體驗
- 完全響應式設計，支援各種裝置
- 使用模擬數據，無需外部 API 連接

## 技術堆疊

- React 18.3
- TypeScript 5.0
- Vite 6.0
- Redux Toolkit - 狀態管理
- Ant Design 5.24 - UI 元件庫
- Axios - 請求處理
- React Router v7 - 路由管理
- Tailwind CSS - 樣式設計
- DayJS - 日期時間處理

## 快速開始

### 前置需求

- Node.js 18+
- npm 9+

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
├── api/                # API 服務與模擬數據處理
│   ├── client.ts       # API 客戶端與請求處理
│   ├── mockApi.ts      # 模擬 API 服務
│   ├── mockData.ts     # 模擬資料來源
│   ├── mockTrainDetails.ts # 模擬列車詳細資料
│   ├── auth.ts         # 認證相關模擬 API
│   ├── train.ts        # 台鐵模擬 API 服務
│   └── index.ts        # API 模組入口
├── assets/             # 靜態資源
│   └── styles/         # 樣式檔案
├── components/         # 可重用元件
│   ├── TrainLayout.tsx # 應用程式佈局組件
│   └── DateTime.tsx    # 日期時間組件
├── pages/              # 應用頁面
│   ├── TrainLoginPage.tsx      # 登入頁面
│   ├── TrainSchedulePage.tsx   # 時刻表頁面
│   ├── TrainDetailsPage.tsx    # 列車詳情頁面
│   ├── DashboardPage.tsx       # 首頁儀表板
│   ├── TicketQueryPage.tsx     # 車票查詢頁面
│   ├── OrdersPage.tsx          # 訂單管理頁面
│   ├── StationInfoPage.tsx     # 站點資訊頁面
│   ├── UserProfilePage.tsx     # 用戶個人資料頁面
│   └── FAQPage.tsx             # 常見問題與幫助中心
├── store/              # Redux 狀態管理
│   ├── authSlice.ts    # 認證狀態管理
│   └── index.ts        # Store 配置
└── utils/              # 工具函數
    └── authStorage.ts  # 認證儲存工具
```

## 模擬數據機制

本專案採用完整的模擬數據機制，無需連接外部 API：

- **mockApi.ts**: 定義模擬 API 的接口，模擬網絡請求的延遲
- **mockData.ts**: 提供模擬的站點資料、列車時刻表等基礎數據
- **mockTrainDetails.ts**: 生成詳細的列車運行資訊，包括時刻、車站等
- **client.ts**: 處理模擬請求，無需實際 API 連接
- **auth.ts**: 提供模擬的用戶認證機制

### 特點

- 完全離線運行，不依賴外部服務
- 模擬網絡延遲，提供真實的使用體驗
- 提供豐富的模擬數據，覆蓋實際應用場景
- 統一的錯誤處理和模擬 API 回應

### 使用示例

```typescript
// 引入 API 功能
import { getAllStations, getTrainByNumber } from '../api/train';
import { loginApi } from '../api/auth';

// 使用 API (實際使用的是模擬數據)
const stations = await getAllStations();
const trainDetails = await getTrainByNumber('123', '2023-04-01');
```

## 用戶界面特色

- **固定側欄**: 頁面滾動時側欄保持固定，提升導航體驗
- **響應式設計**: 適應不同屏幕尺寸，從手機到桌面設備
- **現代化界面**: 使用 Ant Design 和 Tailwind CSS 提供清晰美觀的界面
- **直觀操作**: 簡潔的表單和數據展示方式，提升用戶友好性

## 授權

本專案使用 MIT 授權。

## 作者

Train Schedule Project Team
