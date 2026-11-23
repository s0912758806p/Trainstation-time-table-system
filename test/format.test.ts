import { describe, expect, it } from 'vitest';
import {
  addDays, formatDateLabel, formatDuration, formatPrice, hash, isValidDate, minToTime, timeToMin,
} from '@/lib/format';
import { halfFare, trainTypeFromName } from '@/lib/trainTypes';

describe('format', () => {
  it('minToTime wraps past midnight and handles negatives', () => {
    expect(minToTime(0)).toBe('00:00');
    expect(minToTime(8 * 60 + 5)).toBe('08:05');
    expect(minToTime(1440 + 30)).toBe('00:30');
    expect(minToTime(-30)).toBe('23:30');
  });

  it('timeToMin is the inverse of minToTime within a day', () => {
    for (const t of ['00:00', '07:15', '23:59']) expect(minToTime(timeToMin(t))).toBe(t);
  });

  it('formatDuration', () => {
    expect(formatDuration(45)).toBe('45 分');
    expect(formatDuration(125)).toBe('2 時 05 分');
  });

  it('formatPrice shows a dash when the fare is unknown', () => {
    expect(formatPrice(null)).toBe('—');
    expect(formatPrice(undefined)).toBe('—');
    expect(formatPrice(1234)).toBe('NT$1,234');
  });

  it('addDays crosses month and year boundaries', () => {
    expect(addDays('2026-11-30', 1)).toBe('2026-12-01');
    expect(addDays('2026-12-31', 1)).toBe('2027-01-01');
    expect(addDays('2026-03-01', -1)).toBe('2026-02-28');
  });

  it('isValidDate rejects malformed input', () => {
    expect(isValidDate('2026-11-24')).toBe(true);
    expect(isValidDate('2026/11/24')).toBe(false);
    expect(isValidDate('')).toBe(false);
    expect(isValidDate(null)).toBe(false);
  });

  it('formatDateLabel includes the weekday', () => {
    expect(formatDateLabel('2026-11-24')).toBe('11/24（二）');
  });

  it('hash is stable and unsigned', () => {
    expect(hash('431|2026-11-24')).toBe(hash('431|2026-11-24'));
    expect(hash('a')).not.toBe(hash('b'));
    expect(hash('anything')).toBeGreaterThanOrEqual(0);
  });
});

describe('trainTypes', () => {
  it.each([
    ['自強(3000)(EMU3000 型電車)', 'zq'],
    ['普悠瑪(普悠瑪)', 'pym'],
    ['太魯閣(太魯閣)', 'tlg'],
    ['莒光(無身障座位)', 'jg'],
    ['復興', 'jg'],
    ['區間快', 'qjk'],
    ['區間', 'qj'],
    ['', 'qj'],
  ])('trainTypeFromName(%s) → %s', (name, key) => {
    expect(trainTypeFromName(name)).toBe(key);
  });

  it('halfFare rounds up', () => {
    expect(halfFare(375)).toBe(188);
    expect(halfFare(100)).toBe(50);
  });
});
