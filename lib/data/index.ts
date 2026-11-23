/**
 * 資料存取的唯一入口（僅限伺服器端）。
 *
 * 設定了 TDX_CLIENT_ID / TDX_CLIENT_SECRET 時呼叫 TDX；未設定時直接用 lib/mock 的決定性模擬資料。
 * 原則是「拿不到的資料一律改用模擬資料」，頁面永遠不會因為 TDX 而壞掉：
 * - 整筆拿不到（呼叫失敗、回應缺欄位、回傳空清單、查無該車次／車站）→ 整筆改用模擬資料，source = 'mock'。
 * - 單一欄位拿不到 → 只補該欄位，source 仍為 'tdx'：
 *   票價查不到時依模擬路網里程估算；座位餘額 TDX 不提供，一律用模擬值。
 * 每個函式都回傳 { data, source }，頁尾據此標示資料來源。
 */
import 'server-only';
import { nowMinTW, todayTW } from '../format';
import { STATIONS } from '../mock/network';
import { estimateFare, mockBoard, mockSearch, mockSeat, mockTrain, mockTrip } from '../mock/timetable';
import { TDX_PATHS, tdxConfigured, tdxGet } from '../tdx/client';
import {
  mapBoard, mapStation, mapTrain, pickFare,
  type TdxFare, type TdxLiveBoard, type TdxStation, type TdxTimetable,
} from '../tdx/mappers';
import type { BoardEntry, Sourced, Station, Train, Trip } from '../types';

const MOCK_STATIONS: Station[] = STATIONS.map((s) => ({
  id: s.id, name: s.name, en: s.en, city: s.city, address: s.address, grade: s.grade, region: s.region,
}));

/** real() 丟出任何錯誤（包含「查無資料」）都改用 mock() */
async function withFallback<T>(label: string, real: () => Promise<T>, mock: () => T): Promise<Sourced<T>> {
  if (!tdxConfigured()) return { data: mock(), source: 'mock' };
  try {
    return { data: await real(), source: 'tdx' };
  } catch (err) {
    console.warn(`[data] ${label} 改用模擬資料：`, err instanceof Error ? err.message : err);
    return { data: mock(), source: 'mock' };
  }
}

function nonEmpty<T>(list: T[], what: string): T[] {
  if (!list.length) throw new Error(`${what} empty`);
  return list;
}

export function getStations(): Promise<Sourced<Station[]>> {
  return withFallback(
    'stations',
    async () => {
      const res = await tdxGet<{ Stations?: TdxStation[] }>(TDX_PATHS.stations(), 86400);
      return nonEmpty((res.Stations ?? []).map(mapStation), 'stations');
    },
    () => MOCK_STATIONS,
  );
}

export async function getStation(id: string): Promise<Sourced<Station | null>> {
  const { data, source } = await getStations();
  const found = data.find((s) => s.id === id);
  if (found) return { data: found, source };
  return { data: MOCK_STATIONS.find((s) => s.id === id) ?? null, source: 'mock' };
}

function tripFrom(train: Train, date: string, fromId: string, toId: string, fare: number | null): Trip | null {
  const a = train.stops.findIndex((s) => s.stationId === fromId);
  const b = train.stops.findIndex((s) => s.stationId === toId);
  if (a < 0 || b < 0 || a >= b) return null;
  return {
    train, date, from: train.stops[a], to: train.stops[b],
    durationMin: train.stops[b].arrMin - train.stops[a].depMin,
    stopsBetween: b - a - 1,
    fare: fare ?? estimateFare(train.type, fromId, toId),
    seat: mockSeat(train, date, fromId),
  };
}

export function searchTrips(fromId: string, toId: string, date: string): Promise<Sourced<Trip[]>> {
  return withFallback(
    'search',
    async () => {
      const [tt, fares] = await Promise.all([
        tdxGet<{ TrainTimetables?: TdxTimetable[] }>(TDX_PATHS.odTimetable(fromId, toId, date), 3600),
        tdxGet<{ ODFares?: TdxFare[] }>(TDX_PATHS.odFare(fromId, toId), 86400).catch(() => ({ ODFares: [] })),
      ]);
      const trips = (tt.TrainTimetables ?? [])
        .map(mapTrain)
        .map((train) => tripFrom(train, date, fromId, toId, pickFare(fares.ODFares ?? [], train.type)))
        .filter((t): t is Trip => t !== null)
        .sort((x, y) => x.from.depMin - y.from.depMin);
      return nonEmpty(trips, 'search');
    },
    () => mockSearch(fromId, toId, date),
  );
}

export function getTrain(no: string, date: string): Promise<Sourced<Train | null>> {
  return withFallback(
    'train',
    async () => {
      const res = await tdxGet<{ TrainTimetables?: TdxTimetable[] }>(TDX_PATHS.trainTimetable(no, date), 3600);
      const first = res.TrainTimetables?.[0];
      if (!first) throw new Error(`train ${no} not found`);
      return mapTrain(first);
    },
    () => mockTrain(no),
  );
}

export async function getTrip(no: string, date: string, fromId: string, toId: string): Promise<Sourced<Trip | null>> {
  if (tdxConfigured()) {
    const { data, source } = await searchTrips(fromId, toId, date);
    const found = data.find((t) => t.train.no === no);
    if (found) return { data: found, source };
  }
  return { data: mockTrip(no, date, fromId, toId), source: 'mock' };
}

export function getBoard(stationId: string): Promise<Sourced<BoardEntry[]>> {
  return withFallback(
    'board',
    async () => {
      const res = await tdxGet<{ StationLiveBoards?: TdxLiveBoard[] }>(TDX_PATHS.liveBoard(stationId), 30);
      return nonEmpty((res.StationLiveBoards ?? []).map(mapBoard), 'board').sort((a, b) => a.depMin - b.depMin);
    },
    () => mockBoard(stationId, todayTW(), nowMinTW()),
  );
}
