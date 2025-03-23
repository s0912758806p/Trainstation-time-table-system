import { request } from './client';

// 火車站點數據接口
export interface Station {
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
}

// 火車時刻表數據接口
export interface TrainSchedule {
  TrainInfo: {
    TrainNo: string;
    Direction: number;
    TrainTypeID: string;
    TrainTypeName: {
      Zh_tw: string;
      En: string;
    };
    StartingStationName: {
      Zh_tw: string;
      En: string;
    };
    EndingStationName: {
      Zh_tw: string;
      En: string;
    };
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
  }>;
}

/**
 * 獲取所有火車站
 */
export async function getAllStations(): Promise<Station[]> {
  return request<Station[]>('/Rail/TRA/Station?$format=JSON');
}

/**
 * 獲取特定日期的火車時刻表
 * @param date 日期，格式為YYYY-MM-DD
 */
export async function getDailyTrainSchedule(
  date: string
): Promise<TrainSchedule[]> {
  return request<TrainSchedule[]>(
    `/Rail/TRA/DailyTrainInfo/TrainDate/${date}?$format=JSON`
  );
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
  return request<TrainSchedule[]>(
    `/Rail/TRA/DailyTrainInfo/TrainNo/${trainNo}/TrainDate/${date}?$format=JSON`
  );
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
  return request<TrainSchedule[]>(
    `/Rail/TRA/DailyTrainInfo/OD/${originStationID}/to/${destinationStationID}/TrainDate/${date}?$format=JSON`
  );
}
