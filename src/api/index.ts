// API 服務入口文件
// 導出所有 API 相關功能供應用使用

// 導出台鐵 API 函數和類型
export * from './train';

// 導出身份驗證 API 函數和類型
export * from './auth';

// 導出通用的 request 函數和默認的 apiClient 實例
export {
  request,
  fetchData,
  postData,
  putData,
  deleteData,
  default as apiClient,
} from './client';
