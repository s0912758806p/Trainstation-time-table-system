/**
 * 決定性的模擬時刻表：同一個車次在任何一天都有相同的車種與停靠站，
 * 座位與誤點狀態則依「車次＋日期」雜湊產生，重新整理也不會變。
 */
import { hash, minToTime } from '../format';
import { TRAIN_TYPES } from '../trainTypes';
import type { BoardEntry, SeatStatus, StopTime, Train, TrainTypeKey, Trip } from '../types';
import { LINES, RUN, SERVICES, STATION_BY_ID, type Line, type ServiceTemplate } from './network';

interface Generated {
  train: Train;
  line: Line;
  /** 每個停靠站在路線上的里程 */
  km: Map<string, number>;
  direction: 0 | 1;
}

function buildTrain(t: ServiceTemplate, index: number): Generated {
  const line = LINES.find((l) => l.id === t.line)!;
  const iFrom = line.stations.findIndex((s) => s.id === t.from);
  const iTo = line.stations.findIndex((s) => s.id === t.to);
  const step = iTo > iFrom ? 1 : -1;
  const run = RUN[t.type];
  const stops: StopTime[] = [];
  const km = new Map<string, number>();
  let clock = t.first + index * t.every;
  let prevKm = line.stations[iFrom].km;

  for (let i = iFrom; i !== iTo + step; i += step) {
    const s = line.stations[i];
    const st = STATION_BY_ID.get(s.id)!;
    const isEnd = i === iFrom || i === iTo;
    if (!isEnd && st.level > run.maxLevel) continue;
    const travel = (Math.abs(s.km - prevKm) / run.speed) * 60;
    const arr = i === iFrom ? clock : clock + travel;
    const dep = isEnd ? arr : arr + run.dwell;
    stops.push({
      seq: stops.length + 1,
      stationId: s.id,
      stationName: st.name,
      arrMin: Math.round(arr),
      depMin: Math.round(dep),
      arr: minToTime(arr),
      dep: minToTime(dep),
    });
    km.set(s.id, s.km);
    clock = dep;
    prevKm = s.km;
  }

  const no = String(t.noBase + index * 2);
  return {
    line,
    km,
    direction: step === 1 ? line.ascendingDirection : ((1 - line.ascendingDirection) as 0 | 1),
    train: {
      no,
      type: t.type,
      typeName: t.typeName,
      originName: STATION_BY_ID.get(t.from)!.name,
      destName: STATION_BY_ID.get(t.to)!.name,
      line: line.name,
      stops,
      services: t.services,
    },
  };
}

let cache: Generated[] | null = null;

function allTrains(): Generated[] {
  if (cache) return cache;
  cache = SERVICES.flatMap((t) => {
    const count = Math.floor((t.last - t.first) / t.every) + 1;
    return Array.from({ length: count }, (_, i) => buildTrain(t, i));
  });
  return cache;
}

/** 座位狀態依「車次＋日期＋上車站」雜湊；TDX 不提供座位餘額，真實資料也沿用這個模擬值 */
export function mockSeat(train: Train, date: string, fromId: string): SeatStatus {
  if (!TRAIN_TYPES[train.type].reservable) return 'free';
  const r = hash(`${train.no}|${date}|${fromId}`) % 10;
  if (r === 0) return 'none';
  if (r <= 2) return 'few';
  return 'ok';
}

const fareByKm = (type: TrainTypeKey, km: number) => Math.max(15, Math.round(km * TRAIN_TYPES[type].farePerKm));

function fareFor(g: Generated, fromId: string, toId: string): number {
  return fareByKm(g.train.type, Math.abs((g.km.get(toId) ?? 0) - (g.km.get(fromId) ?? 0)));
}

/**
 * 依模擬路網里程估算全票票價，用於 TDX 查不到票價時補值。
 * 起訖站不在同一條模擬路線上時回傳 null（頁面會顯示「—」並停止訂票）。
 */
export function estimateFare(type: TrainTypeKey, fromId: string, toId: string): number | null {
  for (const line of LINES) {
    const a = line.stations.find((s) => s.id === fromId);
    const b = line.stations.find((s) => s.id === toId);
    if (a && b && a !== b) return fareByKm(type, Math.abs(b.km - a.km));
  }
  return null;
}

function toTrip(g: Generated, date: string, fromId: string, toId: string): Trip | null {
  const stops = g.train.stops;
  const a = stops.findIndex((s) => s.stationId === fromId);
  const b = stops.findIndex((s) => s.stationId === toId);
  if (a < 0 || b < 0 || a >= b) return null;
  return {
    train: g.train,
    date,
    from: stops[a],
    to: stops[b],
    durationMin: stops[b].arrMin - stops[a].depMin,
    stopsBetween: b - a - 1,
    fare: fareFor(g, fromId, toId),
    seat: mockSeat(g.train, date, fromId),
  };
}

export function mockSearch(fromId: string, toId: string, date: string): Trip[] {
  return allTrains()
    .map((g) => toTrip(g, date, fromId, toId))
    .filter((t): t is Trip => t !== null)
    .sort((x, y) => x.from.depMin % 1440 - y.from.depMin % 1440);
}

export function mockTrain(no: string): Train | null {
  return allTrains().find((g) => g.train.no === no)?.train ?? null;
}

export function mockTrip(no: string, date: string, fromId: string, toId: string): Trip | null {
  const g = allTrains().find((x) => x.train.no === no);
  return g ? toTrip(g, date, fromId, toId) : null;
}

/** 車站即時看板：nowMin 之後的發車班次（含誤點與月台），每個方向最多 limit 班 */
export function mockBoard(stationId: string, date: string, nowMin: number, limit = 8): BoardEntry[] {
  const entries: BoardEntry[] = [];
  for (const g of allTrains()) {
    const stops = g.train.stops;
    const i = stops.findIndex((s) => s.stationId === stationId);
    if (i < 0 || i === stops.length - 1) continue;
    const dep = stops[i].depMin % 1440;
    if (dep < nowMin - 2) continue;
    const r = hash(`${g.train.no}|${date}|board`);
    entries.push({
      time: stops[i].dep,
      depMin: dep,
      trainNo: g.train.no,
      type: g.train.type,
      typeName: g.train.typeName,
      destName: g.train.destName,
      platform: `${(r % 2) + (g.direction === 0 ? 3 : 4)}${r % 3 === 0 ? 'B' : 'A'}`.replace(/^5/, '3'),
      delayMin: r % 9 === 0 ? 3 + (r % 8) : 0,
      direction: g.direction,
    });
  }
  entries.sort((a, b) => a.depMin - b.depMin);
  return [
    ...entries.filter((e) => e.direction === 0).slice(0, limit),
    ...entries.filter((e) => e.direction === 1).slice(0, limit),
  ].sort((a, b) => a.depMin - b.depMin);
}
