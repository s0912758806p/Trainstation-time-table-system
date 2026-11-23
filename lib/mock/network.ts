/**
 * 模擬路網：車站、路線里程與每日班次樣板。
 * 站碼沿用臺鐵實際站碼，未來切換到 TDX 時網址（/stations/1000）仍然有效。
 * 里程為近似值，只用來推算行車時間與票價。
 */
import type { Region, Station, TrainTypeKey } from '../types';

type StopLevel = 1 | 2 | 3; // 1 = 對號列車停靠、2 = 莒光／區間快加停、3 = 僅區間車停靠

interface StationSeed extends Station {
  level: StopLevel;
}

const S = (
  id: string, name: string, en: string, city: string, address: string,
  grade: string, region: Region, level: StopLevel,
): StationSeed => ({ id, name, en, city, address, grade, region, level });

export const STATIONS: StationSeed[] = [
  S('0900', '基隆', 'Keelung', '基隆市', '基隆市仁愛區港西街 5 號', '一等站', 'north', 1),
  S('0930', '七堵', 'Qidu', '基隆市', '基隆市七堵區東新街 2 號', '一等站', 'north', 1),
  S('0980', '南港', 'Nangang', '臺北市', '臺北市南港區南港路一段 313 號', '一等站', 'north', 1),
  S('0990', '松山', 'Songshan', '臺北市', '臺北市信義區松山路 11 號', '一等站', 'north', 1),
  S('1000', '臺北', 'Taipei', '臺北市', '臺北市中正區北平西路 3 號', '特等站', 'north', 1),
  S('1020', '板橋', 'Banqiao', '新北市', '新北市板橋區縣民大道二段 7 號', '一等站', 'north', 1),
  S('1080', '桃園', 'Taoyuan', '桃園市', '桃園市桃園區中正路 1 號', '一等站', 'north', 1),
  S('1100', '中壢', 'Zhongli', '桃園市', '桃園市中壢區中和路 139 號', '一等站', 'north', 2),
  S('1210', '新竹', 'Hsinchu', '新竹市', '新竹市東區中華路二段 445 號', '一等站', 'north', 1),
  S('3160', '苗栗', 'Miaoli', '苗栗縣', '苗栗縣苗栗市為公路 1 號', '一等站', 'central', 2),
  S('3230', '豐原', 'Fengyuan', '臺中市', '臺中市豐原區復興路 2 號', '一等站', 'central', 2),
  S('3300', '臺中', 'Taichung', '臺中市', '臺中市東區臺中路 1 號', '特等站', 'central', 1),
  S('3360', '彰化', 'Changhua', '彰化縣', '彰化縣彰化市三民路 1 號', '一等站', 'central', 1),
  S('3470', '斗六', 'Douliu', '雲林縣', '雲林縣斗六市斗六一路 1 號', '一等站', 'central', 2),
  S('4080', '嘉義', 'Chiayi', '嘉義市', '嘉義市西區中山路 528 號', '一等站', 'south', 1),
  S('4220', '臺南', 'Tainan', '臺南市', '臺南市東區北門路二段 4 號', '一等站', 'south', 1),
  S('4400', '高雄', 'Kaohsiung', '高雄市', '高雄市三民區建國二路 318 號', '特等站', 'south', 1),
  S('5000', '屏東', 'Pingtung', '屏東縣', '屏東縣屏東市公勇路 69 號', '一等站', 'south', 1),
  S('7190', '宜蘭', 'Yilan', '宜蘭縣', '宜蘭縣宜蘭市光復路 1 號', '一等站', 'east', 1),
  S('7160', '羅東', 'Luodong', '宜蘭縣', '宜蘭縣羅東鎮公正路 1 號', '一等站', 'east', 1),
  S('7000', '花蓮', 'Hualien', '花蓮縣', '花蓮縣花蓮市國聯一路 100 號', '一等站', 'east', 1),
  S('6110', '玉里', 'Yuli', '花蓮縣', '花蓮縣玉里鎮中山路一段 1 號', '二等站', 'east', 1),
  S('6000', '臺東', 'Taitung', '臺東縣', '臺東縣臺東市岩灣路 101 巷 598 號', '一等站', 'east', 1),
];

export const STATION_BY_ID = new Map(STATIONS.map((s) => [s.id, s]));

export interface Line {
  id: 'west' | 'east';
  name: string;
  /** 依站序排列的站碼與里程（公里） */
  stations: { id: string; km: number }[];
  /**
   * 站序遞增時的行駛方向。環島同向需一致：西部幹線往南（臺北→高雄）與
   * 東部幹線往臺北（花蓮→臺北）是同一個繞行方向，因此東部幹線由臺北出發為 1。
   */
  ascendingDirection: 0 | 1;
}

export const LINES: Line[] = [
  {
    id: 'west',
    name: '西部幹線',
    ascendingDirection: 0,
    stations: [
      ['0900', 0], ['0930', 7.6], ['0980', 21.4], ['0990', 23.9], ['1000', 28.3], ['1020', 35.5],
      ['1080', 57.1], ['1100', 67.0], ['1210', 106.4], ['3160', 147.0], ['3230', 182.0], ['3300', 193.5],
      ['3360', 210.5], ['3470', 248.0], ['4080', 291.0], ['4220', 353.0], ['4400', 399.7], ['5000', 414.0],
    ].map(([id, km]) => ({ id: id as string, km: km as number })),
  },
  {
    id: 'east',
    name: '東部幹線',
    ascendingDirection: 1,
    stations: [
      ['1000', 0], ['0990', 4.4], ['0980', 6.9], ['0930', 20.7], ['7190', 96.0], ['7160', 103.0],
      ['7000', 194.0], ['6110', 280.0], ['6000', 345.0],
    ].map(([id, km]) => ({ id: id as string, km: km as number })),
  },
];

/** 各車種平均運行速度（km/h）與每站停靠分鐘數、可停靠的最低站等級 */
export const RUN: Record<TrainTypeKey, { speed: number; dwell: number; maxLevel: StopLevel }> = {
  zq: { speed: 105, dwell: 2, maxLevel: 1 },
  pym: { speed: 112, dwell: 2, maxLevel: 1 },
  tlg: { speed: 112, dwell: 2, maxLevel: 1 },
  jg: { speed: 82, dwell: 2, maxLevel: 2 },
  qjk: { speed: 72, dwell: 1, maxLevel: 2 },
  qj: { speed: 56, dwell: 1, maxLevel: 3 },
};

export interface ServiceTemplate {
  line: Line['id'];
  type: TrainTypeKey;
  typeName: string;
  from: string;
  to: string;
  /** 始發站首班、末班發車時間（分鐘） */
  first: number;
  last: number;
  every: number;
  noBase: number;
  services: { wheelchair: boolean; bike: boolean; nursing: boolean };
}

const h = (hh: number, mm = 0) => hh * 60 + mm;
const ALL = { wheelchair: true, bike: true, nursing: true };
const BASIC = { wheelchair: true, bike: false, nursing: false };

/** 順行（站序遞增）樣板；逆行班次由 mirror() 產生，車次號 +1 */
const FORWARD: ServiceTemplate[] = [
  { line: 'west', type: 'zq', typeName: '自強(3000)', from: '0930', to: '5000', first: h(6), last: h(20), every: 60, noBase: 101, services: ALL },
  { line: 'west', type: 'pym', typeName: '普悠瑪', from: '1000', to: '4400', first: h(6, 30), last: h(18, 30), every: 120, noBase: 151, services: { wheelchair: true, bike: false, nursing: true } },
  { line: 'west', type: 'jg', typeName: '莒光', from: '0930', to: '4400', first: h(7, 10), last: h(19, 40), every: 150, noBase: 511, services: { wheelchair: true, bike: true, nursing: false } },
  { line: 'west', type: 'qjk', typeName: '區間快', from: '0900', to: '1210', first: h(6, 20), last: h(21, 20), every: 60, noBase: 1151, services: BASIC },
  { line: 'west', type: 'qj', typeName: '區間', from: '0900', to: '1100', first: h(5, 40), last: h(22, 40), every: 30, noBase: 2101, services: BASIC },
  { line: 'west', type: 'qj', typeName: '區間', from: '1210', to: '3300', first: h(6), last: h(21), every: 60, noBase: 2301, services: BASIC },
  { line: 'west', type: 'qj', typeName: '區間', from: '3300', to: '4080', first: h(6, 10), last: h(21, 10), every: 60, noBase: 2501, services: BASIC },
  { line: 'west', type: 'qj', typeName: '區間', from: '4080', to: '5000', first: h(6, 5), last: h(21, 5), every: 60, noBase: 2701, services: BASIC },
  { line: 'east', type: 'tlg', typeName: '太魯閣', from: '1000', to: '7000', first: h(6, 40), last: h(18, 40), every: 120, noBase: 401, services: { wheelchair: true, bike: false, nursing: true } },
  { line: 'east', type: 'pym', typeName: '普悠瑪', from: '1000', to: '6000', first: h(7, 15), last: h(19, 15), every: 180, noBase: 431, services: { wheelchair: true, bike: false, nursing: true } },
  { line: 'east', type: 'zq', typeName: '自強(3000)', from: '1000', to: '6000', first: h(8), last: h(17), every: 180, noBase: 171, services: ALL },
  { line: 'east', type: 'qj', typeName: '區間', from: '1000', to: '7160', first: h(6), last: h(21), every: 90, noBase: 4101, services: BASIC },
];

/** 逆行樣板：起訖對調、發車時間錯開 25 分鐘、車次號為偶數 */
function mirror(t: ServiceTemplate): ServiceTemplate {
  return { ...t, from: t.to, to: t.from, first: t.first + 25, last: t.last + 25, noBase: t.noBase + 1 };
}

export const SERVICES: ServiceTemplate[] = [...FORWARD, ...FORWARD.map(mirror)];
