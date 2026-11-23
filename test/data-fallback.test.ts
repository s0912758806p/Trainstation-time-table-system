/**
 * lib/data 的「拿不到就用模擬資料」行為：整筆失敗→整筆 mock；單一欄位缺→只補該欄位。
 */
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { estimateFare, mockSearch, mockTrain } from '@/lib/mock/timetable';
import { tdxConfigured, tdxGet } from '@/lib/tdx/client';
import type { TdxTimetable } from '@/lib/tdx/mappers';

vi.mock('@/lib/tdx/client', async (importOriginal) => ({
  ...(await importOriginal<typeof import('@/lib/tdx/client')>()),
  tdxConfigured: vi.fn(),
  tdxGet: vi.fn(),
}));

const { getBoard, getStation, getTrain, getTrip, searchTrips } = await import('@/lib/data');

const DATE = '2026-11-24';
const configured = vi.mocked(tdxConfigured);
const get = vi.mocked(tdxGet);

const timetable = (no: string, typeName = '自強(3000)'): TdxTimetable => ({
  TrainInfo: { TrainNo: no, TrainTypeName: { Zh_tw: typeName }, StartingStationName: { Zh_tw: '臺北' }, EndingStationName: { Zh_tw: '高雄' } },
  StopTimes: [
    { StopSequence: 1, StationID: '1000', StationName: { Zh_tw: '臺北' }, DepartureTime: '08:00' },
    { StopSequence: 2, StationID: '4400', StationName: { Zh_tw: '高雄' }, ArrivalTime: '11:30' },
  ],
});

/** 依路徑回傳假資料；未列出的路徑視為呼叫失敗 */
function respond(routes: Record<string, unknown>) {
  get.mockImplementation(async (path: string) => {
    const key = Object.keys(routes).find((k) => path.includes(k));
    if (!key) throw new Error(`TDX 500 ${path}`);
    return routes[key] as never;
  });
}

describe('data facade', () => {
  beforeEach(() => {
    get.mockReset();
    configured.mockReturnValue(true);
    vi.spyOn(console, 'warn').mockImplementation(() => {});
  });

  it('uses mock data without calling TDX when keys are not configured', async () => {
    configured.mockReturnValue(false);
    const res = await searchTrips('1000', '4400', DATE);
    expect(res.source).toBe('mock');
    expect(res.data).toEqual(mockSearch('1000', '4400', DATE));
    expect(get).not.toHaveBeenCalled();
  });

  it('falls back to mock data and logs when TDX fails', async () => {
    respond({});
    const res = await searchTrips('1000', '4400', DATE);
    expect(res.source).toBe('mock');
    expect(res.data.length).toBeGreaterThan(0);
    expect(console.warn).toHaveBeenCalledWith(expect.stringContaining('search 改用模擬資料'), expect.anything());
  });

  it('falls back when TDX returns an empty list', async () => {
    respond({ '/OD/': { TrainTimetables: [] }, ODFare: { ODFares: [] } });
    expect((await searchTrips('1000', '4400', DATE)).source).toBe('mock');
  });

  it('falls back when TDX returns malformed records', async () => {
    respond({ '/OD/': { TrainTimetables: [{ TrainInfo: {} }] }, ODFare: { ODFares: [] } });
    expect((await searchTrips('1000', '4400', DATE)).source).toBe('mock');
  });

  it('keeps TDX trips and uses the TDX fare when available', async () => {
    respond({
      '/OD/': { TrainTimetables: [timetable('123')] },
      ODFare: { ODFares: [{ Fares: [{ TicketType: 1, FareClass: 1, Price: 843 }] }] },
    });
    const res = await searchTrips('1000', '4400', DATE);
    expect(res.source).toBe('tdx');
    expect(res.data).toHaveLength(1);
    expect(res.data[0]).toMatchObject({ fare: 843, durationMin: 210 });
    expect(['ok', 'few', 'none']).toContain(res.data[0].seat);
  });

  it('fills only the missing fare with an estimate when the fare call fails', async () => {
    respond({ '/OD/': { TrainTimetables: [timetable('123')] } });
    const res = await searchTrips('1000', '4400', DATE);
    expect(res.source).toBe('tdx');
    expect(res.data[0].fare).toBe(estimateFare('zq', '1000', '4400'));
  });

  it('getTrain falls back to the mock train when TDX has no such train', async () => {
    respond({ TrainNo: { TrainTimetables: [] } });
    const res = await getTrain('101', DATE);
    expect(res).toEqual({ data: mockTrain('101'), source: 'mock' });
  });

  it('getTrip falls back to the mock trip when the TDX search lacks the train', async () => {
    respond({ '/OD/': { TrainTimetables: [timetable('123')] }, ODFare: { ODFares: [] } });
    const res = await getTrip('101', DATE, '1000', '4400');
    expect(res.source).toBe('mock');
    expect(res.data?.train.no).toBe('101');
  });

  it('getStation falls back to mock station info for unknown ids', async () => {
    respond({ Station: { Stations: [{ StationID: '9999', StationName: { Zh_tw: '測試' } }] } });
    expect(await getStation('9999')).toMatchObject({ source: 'tdx', data: { name: '測試' } });
    expect(await getStation('4400')).toMatchObject({ source: 'mock', data: { name: '高雄' } });
  });

  it('getBoard falls back when the live board is empty', async () => {
    respond({ StationLiveBoard: { StationLiveBoards: [] } });
    expect((await getBoard('1000')).source).toBe('mock');
  });
});
