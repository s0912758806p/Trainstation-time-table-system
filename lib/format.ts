/** 顯示用格式化工具；所有日期都以臺灣時間（Asia/Taipei）計算。 */

const TZ = 'Asia/Taipei';
const DOW = ['日', '一', '二', '三', '四', '五', '六'];

export const pad2 = (n: number) => String(n).padStart(2, '0');

/** 絕對分鐘數 → HH:MM（跨日時取 24 小時制） */
export function minToTime(min: number): string {
  const m = ((Math.round(min) % 1440) + 1440) % 1440;
  return `${pad2(Math.floor(m / 60))}:${pad2(m % 60)}`;
}

export function timeToMin(t: string): number {
  const [h, m] = t.split(':').map(Number);
  return h * 60 + m;
}

export function formatDuration(min: number): string {
  const h = Math.floor(min / 60);
  const m = Math.round(min % 60);
  if (h === 0) return `${m} 分`;
  return `${h} 時 ${pad2(m)} 分`;
}

export function formatPrice(n: number | null | undefined): string {
  if (n == null) return '—';
  return `NT$${n.toLocaleString('en-US')}`;
}

/** 今天（臺灣時間）YYYY-MM-DD */
export function todayTW(): string {
  return new Intl.DateTimeFormat('en-CA', { timeZone: TZ, year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date());
}

/** 現在（臺灣時間）從午夜起算的分鐘數 */
export function nowMinTW(): number {
  const parts = new Intl.DateTimeFormat('en-GB', { timeZone: TZ, hour: '2-digit', minute: '2-digit', hour12: false }).formatToParts(new Date());
  const h = Number(parts.find((p) => p.type === 'hour')?.value ?? 0);
  const m = Number(parts.find((p) => p.type === 'minute')?.value ?? 0);
  return (h % 24) * 60 + m;
}

function parseDate(date: string): Date {
  const [y, m, d] = date.split('-').map(Number);
  return new Date(Date.UTC(y, m - 1, d));
}

export function addDays(date: string, days: number): string {
  const d = parseDate(date);
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}

export function isValidDate(date: string | undefined | null): date is string {
  return !!date && /^\d{4}-\d{2}-\d{2}$/.test(date) && !Number.isNaN(parseDate(date).getTime());
}

export const weekday = (date: string) => DOW[parseDate(date).getUTCDay()];

/**
 * 快速日期「週六」：今天之後、且不是明天的下一個星期六。
 * 明天剛好是星期六時改顯示下週六，避免和「明天」重複。
 */
export function nextSaturday(today: string): string {
  for (let i = 2; i <= 8; i++) {
    const d = addDays(today, i);
    if (parseDate(d).getUTCDay() === 6) return d;
  }
  return addDays(today, 2);
}

/** 2026-11-24 → 11/24（二） */
export function formatDateLabel(date: string): string {
  const [, m, d] = date.split('-');
  return `${m}/${d}（${weekday(date)}）`;
}

/** 2026-11-24 → 11/24 */
export function formatMonthDay(date: string): string {
  const [, m, d] = date.split('-');
  return `${m}/${d}`;
}

/** 簡單穩定雜湊，讓模擬資料在同樣輸入下結果一致 */
export function hash(input: string): number {
  let h = 2166136261;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}
