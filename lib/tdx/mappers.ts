/**
 * TDX 原始回應 → 領域型別。欄位一律以可選鏈讀取，缺欄位時丟出錯誤讓上層改用模擬資料。
 */
import { timeToMin } from '../format';
import { trainTypeFromName } from '../trainTypes';
import type { BoardEntry, Region, Station, StopTime, Train, TrainTypeKey } from '../types';

type Name = { Zh_tw?: string; En?: string };

export interface TdxStation {
  StationID?: string;
  StationName?: Name;
  StationAddress?: string;
  StationClass?: string;
  LocationCity?: string;
}

export interface TdxTimetable {
  TrainInfo?: {
    TrainNo?: string;
    Direction?: number;
    TrainTypeName?: Name;
    StartingStationName?: Name;
    EndingStationName?: Name;
    WheelChairFlag?: number;
    BikeFlag?: number;
    BreastFeedingFlag?: number;
  };
  StopTimes?: {
    StopSequence?: number;
    StationID?: string;
    StationName?: Name;
    ArrivalTime?: string;
    DepartureTime?: string;
  }[];
}

export interface TdxFare {
  Fares?: { TicketType?: number; FareClass?: number; Price?: number }[];
}

export interface TdxLiveBoard {
  TrainNo?: string;
  Direction?: number;
  TrainTypeName?: Name;
  EndingStationName?: Name;
  ScheduleDepartureTime?: string;
  DelayTime?: number;
  Platform?: string;
}

const norm = (s = '') => s.replace(/台/g, '臺');

const REGION_BY_CITY: [RegExp, Region][] = [
  [/宜蘭|花蓮|臺東/, 'east'],
  [/嘉義|臺南|高雄|屏東/, 'south'],
  [/苗栗|臺中|彰化|南投|雲林/, 'central'],
];

const GRADE = ['特等站', '一等站', '二等站', '三等站', '簡易站', '招呼站'];

export function mapStation(s: TdxStation): Station {
  if (!s.StationID || !s.StationName?.Zh_tw) throw new Error('TDX station missing fields');
  const city = norm(s.LocationCity);
  return {
    id: s.StationID,
    name: norm(s.StationName.Zh_tw),
    en: s.StationName.En ?? '',
    city,
    address: norm(s.StationAddress),
    grade: GRADE[Number(s.StationClass)] ?? '車站',
    region: REGION_BY_CITY.find(([re]) => re.test(city))?.[1] ?? 'north',
  };
}

/** 把跨日時間轉為遞增的絕對分鐘數 */
function toStops(raw: NonNullable<TdxTimetable['StopTimes']>): StopTime[] {
  let offset = 0;
  let prev = -1;
  return raw
    .slice()
    .sort((a, b) => (a.StopSequence ?? 0) - (b.StopSequence ?? 0))
    .map((st, i) => {
      const arrRaw = st.ArrivalTime ?? st.DepartureTime ?? '00:00';
      const depRaw = st.DepartureTime ?? arrRaw;
      let arrMin = timeToMin(arrRaw) + offset;
      if (arrMin < prev) { offset += 1440; arrMin += 1440; }
      let depMin = timeToMin(depRaw) + offset;
      if (depMin < arrMin) { offset += 1440; depMin += 1440; }
      prev = depMin;
      return {
        seq: i + 1,
        stationId: st.StationID ?? '',
        stationName: norm(st.StationName?.Zh_tw),
        arr: arrRaw.slice(0, 5),
        dep: depRaw.slice(0, 5),
        arrMin,
        depMin,
      };
    });
}

export function mapTrain(t: TdxTimetable): Train {
  const info = t.TrainInfo;
  if (!info?.TrainNo || !t.StopTimes?.length) throw new Error('TDX timetable missing fields');
  const typeName = info.TrainTypeName?.Zh_tw ?? '';
  return {
    no: info.TrainNo,
    type: trainTypeFromName(typeName),
    typeName: typeName.replace(/\([^()]*型[^()]*\)/g, ''),
    originName: norm(info.StartingStationName?.Zh_tw),
    destName: norm(info.EndingStationName?.Zh_tw),
    line: '',
    stops: toStops(t.StopTimes),
    services: {
      wheelchair: info.WheelChairFlag === 1,
      bike: info.BikeFlag === 1,
      nursing: info.BreastFeedingFlag === 1,
    },
  };
}

/**
 * ODFare 依車種分組，各車種代碼與本系統的對應尚待以正式金鑰驗證。
 * 先採保守推估：對號快車取最高成人票價、莒光取次高、區間取最低。
 */
export function pickFare(fares: TdxFare[], type: TrainTypeKey): number | null {
  const adult = fares
    .flatMap((f) => f.Fares ?? [])
    .filter((f) => (f.TicketType ?? 1) === 1 && (f.FareClass ?? 1) === 1 && typeof f.Price === 'number')
    .map((f) => f.Price as number);
  const prices = [...new Set(adult)].sort((a, b) => b - a);
  if (!prices.length) return null;
  if (type === 'zq' || type === 'pym' || type === 'tlg') return prices[0];
  if (type === 'jg') return prices[Math.min(1, prices.length - 1)];
  return prices[prices.length - 1];
}

export function mapBoard(b: TdxLiveBoard): BoardEntry {
  if (!b.TrainNo || !b.ScheduleDepartureTime) throw new Error('TDX live board missing fields');
  const typeName = b.TrainTypeName?.Zh_tw ?? '';
  const time = b.ScheduleDepartureTime.slice(0, 5);
  return {
    time,
    depMin: timeToMin(time),
    trainNo: b.TrainNo,
    type: trainTypeFromName(typeName),
    typeName,
    destName: norm(b.EndingStationName?.Zh_tw),
    platform: b.Platform ?? '—',
    delayMin: b.DelayTime ?? 0,
    direction: b.Direction === 1 ? 1 : 0,
  };
}
