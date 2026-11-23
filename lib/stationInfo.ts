/**
 * 車站設施與轉乘資訊（展示用）。TDX 未提供這類資料，依車站等級推估；
 * 正式上線前應改接車站營運資料。
 */
export const FACILITIES_BY_GRADE: Record<string, [string, string][]> = {
  特等站: [['售票窗口', '06:00–23:30'], ['自動售票機', '大廳、地下層'], ['電梯／無障礙通道', '各月台皆有'], ['無障礙廁所', '大廳、地下層'], ['哺乳室', '旅客服務中心旁'], ['置物櫃', '大中小型']],
  一等站: [['售票窗口', '06:00–22:30'], ['自動售票機', '大廳'], ['電梯／無障礙通道', '各月台皆有'], ['無障礙廁所', '大廳'], ['哺乳室', '服務台旁'], ['置物櫃', '中小型']],
};
export const DEFAULT_FACILITIES: [string, string][] = [['售票窗口', '07:00–20:00'], ['自動售票機', '大廳'], ['無障礙坡道', '進站口']];

export interface Transfer { name: string; note: string; color: string }

export const TRANSFERS: Record<string, Transfer[]> = {
  '1000': [
    { name: '捷運 板南線', note: '站內轉乘，地下一樓', color: '#1D4ED8' },
    { name: '捷運 淡水信義線', note: 'M3／M8 出口', color: '#B42318' },
    { name: '高鐵', note: '同站共構，地下一樓轉乘', color: '#B54708' },
    { name: '機場捷運', note: '經地下街步行約 5 分', color: '#5925DC' },
  ],
  '1020': [
    { name: '捷運 板南線', note: '站內轉乘', color: '#1D4ED8' },
    { name: '捷運 環狀線', note: '經板橋站轉乘', color: '#B54708' },
    { name: '高鐵', note: '同站共構', color: '#B54708' },
  ],
  '0990': [{ name: '捷運 松山新店線', note: '站內轉乘', color: '#067647' }],
  '0980': [{ name: '捷運 板南線', note: '站內轉乘', color: '#1D4ED8' }, { name: '高鐵', note: '同站共構', color: '#B54708' }],
  '4400': [{ name: '高雄捷運 紅線', note: '站內轉乘', color: '#B42318' }],
};
export const DEFAULT_TRANSFERS: Transfer[] = [{ name: '公車／客運', note: '車站前站或後站候車', color: '#067647' }];
