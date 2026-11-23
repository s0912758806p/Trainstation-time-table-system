import { describe, expect, it } from 'vitest';
import { directionLabel } from '@/lib/board';
import { estimateFare, mockBoard, mockSearch, mockSeat, mockTrain, mockTrip } from '@/lib/mock/timetable';

const DATE = '2026-11-24';

describe('mock timetable', () => {
  it('is deterministic for the same train number', () => {
    expect(mockTrain('101')).toEqual(mockTrain('101'));
    expect(mockTrain('101')?.type).toBe('zq');
    expect(mockTrain('999999')).toBeNull();
  });

  it('keeps stop times increasing along the route', () => {
    const stops = mockTrain('101')!.stops;
    for (let i = 1; i < stops.length; i++) {
      expect(stops[i].arrMin).toBeGreaterThanOrEqual(stops[i - 1].depMin);
      expect(stops[i].depMin).toBeGreaterThanOrEqual(stops[i].arrMin);
    }
  });

  it('search only returns trains that stop at origin before destination, sorted by departure', () => {
    const trips = mockSearch('1000', '4400', DATE);
    expect(trips.length).toBeGreaterThan(0);
    for (const t of trips) {
      expect(t.from.stationId).toBe('1000');
      expect(t.to.stationId).toBe('4400');
      expect(t.durationMin).toBeGreaterThan(0);
    }
    const deps = trips.map((t) => t.from.depMin % 1440);
    expect(deps).toEqual([...deps].sort((a, b) => a - b));
    // 反方向的查詢不會出現同一班車
    const back = new Set(mockSearch('4400', '1000', DATE).map((t) => t.train.no));
    expect(trips.some((t) => back.has(t.train.no))).toBe(false);
  });

  it('trip is null when the train runs the other way', () => {
    expect(mockTrip('101', DATE, '1000', '4400')).not.toBeNull();
    expect(mockTrip('101', DATE, '4400', '1000')).toBeNull();
  });

  it('mock fare matches the distance estimate used to fill missing TDX fares', () => {
    const trip = mockTrip('101', DATE, '1000', '4400')!;
    expect(trip.fare).toBe(estimateFare('zq', '1000', '4400'));
    expect(estimateFare('zq', '1000', '1000')).toBeNull();
    expect(estimateFare('zq', '1000', 'nope')).toBeNull();
    // 臺北—花蓮只在東部幹線上
    expect(estimateFare('tlg', '1000', '7000')).toBe(Math.round(194 * 2.27));
    // 最低票價 15 元
    expect(estimateFare('qj', '1000', '0990')).toBe(15);
  });

  it('seat status: commuter trains are unreserved, reservable trains are stable per date', () => {
    expect(mockSeat(mockTrain('2101')!, DATE, '0900')).toBe('free');
    const zq = mockTrain('101')!;
    expect(['ok', 'few', 'none']).toContain(mockSeat(zq, DATE, '1000'));
    expect(mockSeat(zq, DATE, '1000')).toBe(mockSeat(zq, DATE, '1000'));
  });

  it('board lists departures after now, capped per direction', () => {
    const board = mockBoard('1000', DATE, 8 * 60, 5);
    expect(board.filter((e) => e.direction === 0).length).toBeLessThanOrEqual(5);
    expect(board.filter((e) => e.direction === 1).length).toBeLessThanOrEqual(5);
    for (const e of board) expect(e.depMin).toBeGreaterThanOrEqual(8 * 60 - 2);
  });

  it('board directions group trains heading the same way (regression: PR #5)', () => {
    const board = mockBoard('1000', DATE, 6 * 60, 20);
    const dest0 = new Set(board.filter((e) => e.direction === 0).map((e) => e.destName));
    const dest1 = new Set(board.filter((e) => e.direction === 1).map((e) => e.destName));
    // 西部往南與東部往臺北同向（0）；西部往北與東部往花東同向（1）
    expect(dest0.has('高雄') || dest0.has('屏東')).toBe(true);
    expect(dest1.has('花蓮') || dest1.has('臺東')).toBe(true);
    expect(dest0.has('花蓮')).toBe(false);
    expect(dest1.has('高雄')).toBe(false);
    expect(directionLabel(board, 0)).toMatch(/^往.*(屏東|高雄)/);
  });
});
