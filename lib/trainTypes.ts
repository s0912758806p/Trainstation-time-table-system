import type { TrainTypeKey } from './types';

export interface TrainTypeMeta {
  key: TrainTypeKey;
  label: string;
  /** 對號座車種可線上訂位；區間車為自由座 */
  reservable: boolean;
  /** 每公里票價（全票，模擬用） */
  farePerKm: number;
}

export const TRAIN_TYPES: Record<TrainTypeKey, TrainTypeMeta> = {
  zq: { key: 'zq', label: '自強', reservable: true, farePerKm: 2.27 },
  pym: { key: 'pym', label: '普悠瑪', reservable: true, farePerKm: 2.27 },
  tlg: { key: 'tlg', label: '太魯閣', reservable: true, farePerKm: 2.27 },
  jg: { key: 'jg', label: '莒光', reservable: true, farePerKm: 1.75 },
  qjk: { key: 'qjk', label: '區間快', reservable: false, farePerKm: 1.46 },
  qj: { key: 'qj', label: '區間', reservable: false, farePerKm: 1.46 },
};

export const TRAIN_TYPE_ORDER: TrainTypeKey[] = ['zq', 'pym', 'tlg', 'jg', 'qjk', 'qj'];

/** 把 TDX 的車種名稱（例：「自強(3000)(EMU3000 型電車)」）對應到車種代號 */
export function trainTypeFromName(name: string): TrainTypeKey {
  if (name.includes('普悠瑪')) return 'pym';
  if (name.includes('太魯閣')) return 'tlg';
  if (name.includes('自強')) return 'zq';
  if (name.includes('莒光') || name.includes('復興')) return 'jg';
  if (name.includes('區間快')) return 'qjk';
  return 'qj';
}

/** 優惠票（孩童、敬老、愛心）為全票半價，無條件進位 */
export const halfFare = (fare: number) => Math.ceil(fare / 2);
