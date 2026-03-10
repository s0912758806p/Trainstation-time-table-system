/**
 * 模擬網路延遲 (300-800ms)
 * 統一來源，避免各檔案重複定義
 */
export const simulateNetworkDelay = (): Promise<void> => {
  const delay = 300 + Math.random() * 500;
  return new Promise((resolve) => setTimeout(resolve, delay));
};
