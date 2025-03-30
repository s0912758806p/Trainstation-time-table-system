import { request, USE_MOCK_API } from './client';
import { mockTdxApi } from './mockApi';

// 更新 BASE_URL 為 TDX API 端點
const TDX_BASE_URL = 'https://tdx.transportdata.tw/api/basic';

// 是否使用模擬數據 (從 client.ts 導入)
const USE_MOCK_DATA = USE_MOCK_API;

// 火車站點數據接口
export interface Station {
  StationUID: string;
  StationID: string;
  StationName: {
    Zh_tw: string;
    En: string;
  };
  StationPosition: {
    PositionLat: number;
    PositionLon: number;
  };
  StationAddress: string;
  LocationCity: string;
  LocationCityCode: string;
  LocationTown: string;
  LocationTownCode: string;
  StationClass: string;
  StationPhone: string;
}

// 火車時刻表數據接口
export interface TrainSchedule {
  TrainDate: string;
  DailyTrainInfo: {
    TrainNo: string;
    Direction: number;
    TrainTypeID: string;
    TrainTypeName: {
      Zh_tw: string;
      En: string;
    };
    StartingStationID: string;
    StartingStationName: {
      Zh_tw: string;
      En: string;
    };
    EndingStationID: string;
    EndingStationName: {
      Zh_tw: string;
      En: string;
    };
    TripHeadSign: string;
    WheelchairFlag: number;
    BikeFlag: number;
    BreastFeedingFlag: number;
    DailyFlag: number;
    ServiceAddedFlag: number;
    Note: string;
  };
  StopTimes: Array<{
    StopSequence: number;
    StationID: string;
    StationName: {
      Zh_tw: string;
      En: string;
    };
    ArrivalTime: string;
    DepartureTime: string;
    SuspendFlag: number;
  }>;
}

/**
 * 獲取所有火車站
 */
export async function getAllStations(): Promise<Station[]> {
  if (USE_MOCK_DATA) {
    return mockTdxApi.getAllStations();
  }

  try {
    // 使用 TDX API 路徑
    const response = await request<any>(
      '/v2/Rail/TRA/Station?$top=500&$format=JSON'
    );
    return Array.isArray(response) ? response : [];
  } catch (error) {
    console.error('獲取站點失敗', error);
    throw error;
  }
}

/**
 * 獲取特定日期的火車時刻表
 * @param date 日期，格式為YYYY-MM-DD
 */
export async function getDailyTrainSchedule(
  date: string
): Promise<TrainSchedule[]> {
  if (USE_MOCK_DATA) {
    return mockTdxApi.getDailyTrainSchedule(date);
  }

  try {
    // 使用 TDX API 路徑
    const response = await request<any>(
      `/v2/Rail/TRA/DailyTimetable/TrainDate/${date}?$top=500&$format=JSON`
    );
    return Array.isArray(response) ? response : [];
  } catch (error) {
    console.error('獲取時刻表失敗', error);
    throw error;
  }
}

/**
 * 搜索特定車次的詳細信息
 * @param trainNo 車次號碼
 * @param date 日期，格式為YYYY-MM-DD
 */
export async function getTrainByNumber(
  trainNo: string,
  date: string
): Promise<TrainSchedule[]> {
  if (USE_MOCK_DATA) {
    return mockTdxApi.getTrainByNumber(trainNo, date);
  }

  try {
    // 使用 TDX API 路徑
    const response = await request<any>(
      `/v2/Rail/TRA/DailyTimetable/TrainNo/${trainNo}/TrainDate/${date}?$top=30&$format=JSON`
    );
    return Array.isArray(response) ? response : [];
  } catch (error) {
    console.error('獲取車次失敗', error);
    throw error;
  }
}

/**
 * 獲取起點站到終點站的所有列車
 * @param originStationID 起點站ID
 * @param destinationStationID 終點站ID
 * @param date 日期，格式為YYYY-MM-DD
 */
export async function getTrainsByRoute(
  originStationID: string,
  destinationStationID: string,
  date: string
): Promise<TrainSchedule[]> {
  if (USE_MOCK_DATA) {
    return mockTdxApi.getTrainsByRoute(
      originStationID,
      destinationStationID,
      date
    );
  }

  try {
    // 修正 API 路徑格式，使用 TrainDate 參數
    const url = `/v2/Rail/TRA/DailyTimetable/OD/${originStationID}/to/${destinationStationID}/TrainDate/${date}?$top=100&$format=JSON`;

    const response = await request<any>(url);
    return Array.isArray(response) ? response : [];
  } catch (error) {
    console.error('獲取路線失敗', error);
    throw error;
  }
}
