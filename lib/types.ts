/**
 * 領域型別：頁面與元件只依賴這些型別，不直接接觸 TDX 或 mock 的原始格式。
 * 資料來源（TDX / 模擬）由 lib/data 統一轉換成這些型別。
 */

export type TrainTypeKey = 'zq' | 'pym' | 'tlg' | 'jg' | 'qjk' | 'qj';

export type Region = 'north' | 'central' | 'south' | 'east';

export type DataSource = 'tdx' | 'mock';

export interface Station {
  id: string;
  name: string;
  en: string;
  city: string;
  address: string;
  grade: string;
  region: Region;
}

export interface StopTime {
  seq: number;
  stationId: string;
  stationName: string;
  /** HH:MM（可能跨日，顯示時已取 24 小時制） */
  arr: string;
  dep: string;
  /** 從始發站起算的絕對分鐘數，用於排序與計算行車時間 */
  arrMin: number;
  depMin: number;
}

export interface Train {
  no: string;
  type: TrainTypeKey;
  /** 原始車種名稱，例如「自強(3000)」 */
  typeName: string;
  originName: string;
  destName: string;
  line: string;
  stops: StopTime[];
  services: { wheelchair: boolean; bike: boolean; nursing: boolean };
}

/** 座位狀態：free = 自由座（區間車不需訂位） */
export type SeatStatus = 'ok' | 'few' | 'none' | 'free';

export interface Trip {
  train: Train;
  date: string;
  from: StopTime;
  to: StopTime;
  durationMin: number;
  /** 起訖站之間（不含起訖）停靠站數 */
  stopsBetween: number;
  /** 全票票價；無法取得時為 null */
  fare: number | null;
  seat: SeatStatus;
}

export interface BoardEntry {
  time: string;
  depMin: number;
  trainNo: string;
  type: TrainTypeKey;
  typeName: string;
  destName: string;
  platform: string;
  delayMin: number;
  /** 0 = 順行（南下／往東部），1 = 逆行（北上） */
  direction: 0 | 1;
}

export interface Sourced<T> {
  data: T;
  source: DataSource;
}
