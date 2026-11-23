import { describe, expect, it } from 'vitest';
import { mapBoard, mapStation, mapTrain, pickFare, type TdxFare } from '@/lib/tdx/mappers';

describe('TDX mappers', () => {
  it('mapStation normalises 台→臺 and infers the region from the city', () => {
    const s = mapStation({
      StationID: '4400', StationName: { Zh_tw: '高雄', En: 'Kaohsiung' },
      StationAddress: '高雄市三民區', StationClass: '0', LocationCity: '高雄市',
    });
    expect(s).toMatchObject({ id: '4400', name: '高雄', grade: '特等站', region: 'south' });
    expect(mapStation({ StationID: '1', StationName: { Zh_tw: '台東' }, LocationCity: '台東縣' }))
      .toMatchObject({ name: '臺東', city: '臺東縣', region: 'east', grade: '車站' });
  });

  it('mapStation throws on missing fields so the caller falls back to mock data', () => {
    expect(() => mapStation({ StationID: '1' })).toThrow();
  });

  it('mapTrain sorts stops and keeps minutes increasing across midnight', () => {
    const t = mapTrain({
      TrainInfo: { TrainNo: '9', TrainTypeName: { Zh_tw: '自強(3000)(EMU3000 型電車)' }, WheelChairFlag: 1 },
      StopTimes: [
        { StopSequence: 2, StationID: 'B', StationName: { Zh_tw: '乙' }, ArrivalTime: '00:10', DepartureTime: '00:12' },
        { StopSequence: 1, StationID: 'A', StationName: { Zh_tw: '甲' }, DepartureTime: '23:50' },
      ],
    });
    expect(t.type).toBe('zq');
    expect(t.typeName).toBe('自強(3000)');
    expect(t.services.wheelchair).toBe(true);
    expect(t.stops.map((s) => s.stationId)).toEqual(['A', 'B']);
    expect(t.stops[1].arrMin).toBe(1440 + 10);
    expect(t.stops[1].depMin).toBe(1440 + 12);
    expect(t.stops[1].arr).toBe('00:10');
  });

  it('mapTrain throws without stop times', () => {
    expect(() => mapTrain({ TrainInfo: { TrainNo: '1' }, StopTimes: [] })).toThrow();
  });

  it('pickFare: express gets the highest adult fare, commuter the lowest, null when none', () => {
    const fares: TdxFare[] = [{
      Fares: [
        { TicketType: 1, FareClass: 1, Price: 843 },
        { TicketType: 1, FareClass: 1, Price: 650 },
        { TicketType: 1, FareClass: 1, Price: 543 },
        { TicketType: 1, FareClass: 2, Price: 422 }, // 孩童票，不採用
      ],
    }];
    expect(pickFare(fares, 'zq')).toBe(843);
    expect(pickFare(fares, 'jg')).toBe(650);
    expect(pickFare(fares, 'qj')).toBe(543);
    expect(pickFare([], 'zq')).toBeNull();
  });

  it('mapBoard defaults missing platform/delay and maps direction', () => {
    const b = mapBoard({ TrainNo: '1', ScheduleDepartureTime: '08:05:00', Direction: 1, EndingStationName: { Zh_tw: '台東' } });
    expect(b).toMatchObject({ time: '08:05', depMin: 485, platform: '—', delayMin: 0, direction: 1, destName: '臺東' });
    expect(() => mapBoard({ TrainNo: '1' })).toThrow();
  });
});
