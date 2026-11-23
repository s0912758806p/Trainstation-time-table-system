/**
 * 營運公告（展示用固定內容）。日期以「距今天數」表示，畫面上換算成實際日期，避免內容過期。
 */
export interface Notice {
  id: string;
  kind: '異動' | '公告' | '維護';
  title: string;
  body: string;
  daysAgo: number;
}

export const NOTICES: Notice[] = [
  { id: 'n-east-maint', kind: '異動', title: '花東線部分班次調整', body: '因軌道維修，本週末部分普悠瑪、太魯閣班次改點，請出發前再次確認時刻。', daysAgo: 1 },
  { id: 'n-west-extra', kind: '公告', title: '西部幹線尖峰加開區間車', body: '平日尖峰時段新竹—臺北間增加 4 班區間車。', daysAgo: 3 },
  { id: 'n-system', kind: '維護', title: '線上訂票系統例行維護', body: '每週二 02:00–04:00 暫停訂票與付款，查詢功能不受影響。', daysAgo: 5 },
];

export const NOTICE_PILL: Record<Notice['kind'], string> = { 異動: 'pill-warn', 公告: 'pill-info', 維護: 'pill-info' };
