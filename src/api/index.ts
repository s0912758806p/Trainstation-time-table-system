// API 服務入口文件
// 導出所有 API 相關功能供應用使用

// 導出台鐵 API 函數和類型
export * from './train';

// 導出身份驗證 API 函數和類型
export * from './auth';

// 導出通用的數據獲取函數
export { fetchData, postData, putData, deleteData } from './client';

// 導出模擬數據標誌
export { USE_MOCK_API } from './client';
