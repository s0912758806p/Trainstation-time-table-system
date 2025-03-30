import { mockTdxApi } from './mockApi';

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
  return mockTdxApi.getAllStations();
}

/**
 * 獲取特定日期的火車時刻表
 * @param date 日期，格式為YYYY-MM-DD
 */
export async function getDailyTrainSchedule(
  date: string
): Promise<TrainSchedule[]> {
  return mockTdxApi.getDailyTrainSchedule(date);
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
  return mockTdxApi.getTrainByNumber(trainNo, date);
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
  return mockTdxApi.getTrainsByRoute(
    originStationID,
    destinationStationID,
    date
  );
}
