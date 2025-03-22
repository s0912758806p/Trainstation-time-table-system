# 火車時刻表查詢系統

一個基於 React、TypeScript 和 Vite 構建的火車時刻表查詢應用，使用台灣鐵路管理局的公開 API 提供即時列車資訊。

## 功能特點

- 📅 查詢特定日期的列車時刻表
- 🔍 按車次號碼搜尋列車詳細資訊
- 🚉 設定起點站和終點站查詢列車
- 🔐 用戶登入與權限管理
- 📱 響應式設計，適配各種設備

## 技術堆疊

- **前端框架**: React 18.3 + TypeScript
- **構建工具**: Vite 6.0
- **狀態管理**: Redux Toolkit
- **UI 庫**: Ant Design
- **樣式處理**: Tailwind CSS + SCSS
- **HTTP 客戶端**: Fetch API
- **路由管理**: React Router v7

## 開始使用

### 前提條件

- Node.js 16.x 或更高版本
- npm 或 yarn 套件管理器

### 安裝

1. 克隆專案

```bash
git clone https://github.com/your-username/train-station-project.git
cd train-station-project
```

2. 安裝依賴

```bash
npm install
# 或
yarn install
```

3. 設定環境變數

創建 `.env.local` 文件或使用已有的 `.env.local`：

```
VITE_API_URL=https://ptx.transportdata.tw/MOTC/v2
```

### 開發

啟動開發服務器：

```bash
npm run dev
# 或
yarn dev
```

應用將在 http://localhost:5173 或 http://localhost:5174 上運行

### 構建

```bash
npm run build
# 或
yarn build
```

構建文件將輸出到 `dist` 目錄

## 專案結構

```
/src
  /api         - API 請求和數據類型
  /assets      - 靜態資源和樣式
  /components  - 可複用組件
  /pages       - 頁面組件
  /routes      - 路由配置
  /store       - Redux 狀態管理
  /styles      - 全局樣式和變量
```

## 代碼規範

- 使用 ESLint 進行代碼檢查
- 使用 Prettier 進行代碼格式化
- 使用 Stylelint 進行樣式檢查

## 授權

本專案採用 MIT 授權 - 詳見 LICENSE 文件

## 鳴謝

- [台灣交通部 PTX 平臺](https://ptx.transportdata.tw/)
- [React](https://reactjs.org/)
- [Vite](https://vitejs.dev/)
- [Ant Design](https://ant.design/)
- [Tailwind CSS](https://tailwindcss.com/)
