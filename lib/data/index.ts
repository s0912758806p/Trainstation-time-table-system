/**
 * 資料存取的唯一入口（僅限伺服器端）。
 *
 * 設定了 TDX_CLIENT_ID / TDX_CLIENT_SECRET 時呼叫 TDX；未設定或呼叫失敗時改用
 * lib/mock 的決定性模擬資料。每個函式都回傳 { data, source }，頁面據此標示資料來源。
 */
import 'server-only';
import { nowMinTW, todayTW } from '../format';
import { STATIONS } from '../mock/network';
import { mockBoard, mockSearch, mockTrain, mockTrip } from '../mock/timetable';
import { TDX_PATHS, tdxConfigured, tdxGet } from '../tdx/client';
import {
  mapBoard, mapStation, mapTrain, pickFare,
  type TdxFare, type TdxLiveBoard, type TdxStation, type TdxTimetable,
} from '../tdx/mappers';
import { TRAIN_TYPES } from '../trainTypes';
import type { BoardEntry, SeatStatus, Sourced, Station, Train, Trip } from '../types';

const MOCK_STATIONS: Station[] = STATIONS.map((s) => ({
  id: s.id, name: s.name, en: s.en, city: s.city, address: s.address, grade: s.grade, region: s.region,
}));

async function withFallback<T>(label: string, real: () => Promise<T>, mock: () => T): Promise<Sourced<T>> {
  if (!tdxConfigured()) return { data: mock(), source: 'mock' };
  try {
    return { data: await real(), source: 'tdx' };
  } catch (err) {
    console.warn(`[data] ${label} 改用模擬資料：`, err instanceof Error ? err.message : err);
    return { data: mock(), source: 'mock' };
  }
}

export function getStations(): Promise<Sourced<Station[]>> {
  return withFallback(
    'stations',
    async () => {
      const res = await tdxGet<{ Stations?: TdxStation[] }>(TDX_PATHS.stations(), 86400);
      const list = (res.Stations ?? []).map(mapStation);
      if (!list.length) throw new Error('empty');
      return list;
    },
    () => MOCK_STATIONS,
  );
}

export async function getStation(id: string): Promise<Sourced<Station | null>> {
  const { data, source } = await getStations();
  return { data: data.find((s) => s.id === id) ?? null, source };
}

/** TDX 不提供座位餘額的公開資料，對號車種以「可訂位」呈現 */
const tdxSeat = (train: Train): SeatStatus => (TRAIN_TYPES[train.type].reservable ? 'ok' : 'free');

function tripFrom(train: Train, date: string, fromId: string, toId: string, fare: number | null): Trip | null {
  const a = train.stops.findIndex((s) => s.stationId === fromId);
  const b = train.stops.findIndex((s) => s.stationId === toId);
  if (a < 0 || b < 0 || a >= b) return null;
  return {
    train, date, from: train.stops[a], to: train.stops[b],
    durationMin: train.stops[b].arrMin - train.stops[a].depMin,
    stopsBetween: b - a - 1, fare, seat: tdxSeat(train),
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
      return (tt.TrainTimetables ?? [])
        .map(mapTrain)
        .map((train) => tripFrom(train, date, fromId, toId, pickFare(fares.ODFares ?? [], train.type)))
        .filter((t): t is Trip => t !== null)
        .sort((x, y) => x.from.depMin - y.from.depMin);
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
      return first ? mapTrain(first) : null;
    },
    () => mockTrain(no),
  );
}

export async function getTrip(no: string, date: string, fromId: string, toId: string): Promise<Sourced<Trip | null>> {
  if (!tdxConfigured()) return { data: mockTrip(no, date, fromId, toId), source: 'mock' };
  const { data, source } = await searchTrips(fromId, toId, date);
  return { data: data.find((t) => t.train.no === no) ?? null, source };
}

export function getBoard(stationId: string): Promise<Sourced<BoardEntry[]>> {
  return withFallback(
    'board',
    async () => {
      const res = await tdxGet<{ StationLiveBoards?: TdxLiveBoard[] }>(TDX_PATHS.liveBoard(stationId), 30);
      return (res.StationLiveBoards ?? []).map(mapBoard).sort((a, b) => a.depMin - b.depMin);
    },
    () => mockBoard(stationId, todayTW(), nowMinTW()),
  );
}
