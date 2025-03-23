# 火車時刻表查詢系統

這是一個使用台灣鐵路管理局公開 API 的火車時刻表查詢系統，提供即時的列車資訊。

## 功能特色

- 查詢特定日期的火車時刻表
- 根據車次號碼搜尋列車
- 設定出發站與抵達站查詢
- 用戶登入與權限管理
- 響應式設計，適應各種裝置尺寸

## 技術堆疊

- React 18.3
- TypeScript
- Vite 6.0
- Redux Toolkit
- Ant Design
- Tailwind CSS
- Fetch API
- React Router v7

## 開始使用

### 前置需求

- Node.js 18 或更高版本
- npm 9 或更高版本
- PTX 平台 API 金鑰 (申請方式見下文)

### PTX API 設定

本專案使用台灣 PTX 平台 API。您需要：

1. 前往 [PTX 平台](https://ptx.transportdata.tw/PTX/) 註冊帳號
2. 申請 API 開發者金鑰 (App ID 和 App Key)
3. 在專案根目錄創建 `.env` 文件，參照 `.env.example` 設定您的 API 金鑰：

```
VITE_API_URL=https://ptx.transportdata.tw/MOTC/v2
VITE_PTX_APP_ID=您的APP_ID
VITE_PTX_APP_KEY=您的APP_KEY
```

### 安裝

```bash
# 安裝所有依賴
npm install
```

### 開發

```bash
# 啟動開發伺服器
npm run dev
```

### 建置

```bash
# 生產環境建置
npm run build
```

## 專案結構

```
src/
├── api/          # API 請求與相關服務
├── assets/       # 靜態資源（圖片、樣式等）
├── components/   # 可重用的元件
├── hooks/        # 自定義 React Hooks
├── layouts/      # 頁面布局結構
├── pages/        # 應用頁面
├── routes/       # 路由設定
├── store/        # Redux 狀態管理
├── types/        # TypeScript 類型定義
└── utils/        # 通用工具函數
```

## 程式碼標準

- 使用 ESLint 進行程式碼格式與錯誤檢查
- 使用 Prettier 維持程式碼風格一致性
- 使用 Stylelint 確保 CSS/SCSS 的品質

## 授權

本專案使用 MIT 授權。

## 特別感謝

- [React](https://reactjs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [Vite](https://vitejs.dev/)
- [Ant Design](https://ant.design/)
- [Tailwind CSS](https://tailwindcss.com/)
- [PTX 平台](https://ptx.transportdata.tw/PTX/)
