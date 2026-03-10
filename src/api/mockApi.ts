import { Station, TrainSchedule } from './train';
import {
  mockStations,
  generateMockTrainSchedules,
  getMockTrainsByRoute,
  getMockTrainByNumber,
} from './mockData';
import { simulateNetworkDelay } from '../utils/delay';

// 模擬TDX API
export const mockTdxApi = {
  // 獲取所有站點
  async getAllStations(): Promise<Station[]> {
    await simulateNetworkDelay();
    return [...mockStations];
  },

  // 獲取特定日期的列車時刻表
  async getDailyTrainSchedule(date: string): Promise<TrainSchedule[]> {
    await simulateNetworkDelay();
    return generateMockTrainSchedules(date);
  },

  // 根據車次號和日期獲取列車信息
  async getTrainByNumber(
    trainNo: string,
    date: string
  ): Promise<TrainSchedule[]> {
    await simulateNetworkDelay();
    return getMockTrainByNumber(trainNo, date);
  },

  // 根據起點站和終點站獲取列車
  async getTrainsByRoute(
    originStationID: string,
    destinationStationID: string,
    date: string
  ): Promise<TrainSchedule[]> {
    await simulateNetworkDelay();
    return getMockTrainsByRoute(originStationID, destinationStationID, date);
  },
};
