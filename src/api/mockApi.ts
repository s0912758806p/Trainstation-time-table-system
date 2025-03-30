import {
  mockStations,
  generateMockTrainSchedules,
  getMockTrainsByRoute,
  getMockTrainByNumber,
} from './mockData';
import { Station, TrainSchedule } from './train';

// 模擬延遲 (0-300ms)
function simulateNetworkDelay(): Promise<void> {
  const delay = Math.floor(Math.random() * 300);
  return new Promise((resolve) => setTimeout(resolve, delay));
}

/**
 * 模擬 TDX API 的調用接口
 */
export const mockTdxApi = {
  /**
   * 獲取所有火車站
   */
  async getAllStations(): Promise<Station[]> {
    await simulateNetworkDelay();
    return [...mockStations];
  },

  /**
   * 獲取特定日期的火車時刻表
   * @param date 日期，格式為YYYY-MM-DD
   */
  async getDailyTrainSchedule(date: string): Promise<TrainSchedule[]> {
    await simulateNetworkDelay();
    return generateMockTrainSchedules(date);
  },

  /**
   * 搜索特定車次的詳細信息
   * @param trainNo 車次號碼
   * @param date 日期，格式為YYYY-MM-DD
   */
  async getTrainByNumber(
    trainNo: string,
    date: string
  ): Promise<TrainSchedule[]> {
    await simulateNetworkDelay();
    return getMockTrainByNumber(trainNo, date);
  },

  /**
   * 獲取起點站到終點站的所有列車
   * @param originStationID 起點站ID
   * @param destinationStationID 終點站ID
   * @param date 日期，格式為YYYY-MM-DD
   */
  async getTrainsByRoute(
    originStationID: string,
    destinationStationID: string,
    date: string
  ): Promise<TrainSchedule[]> {
    await simulateNetworkDelay();
    return getMockTrainsByRoute(originStationID, destinationStationID, date);
  },
};
