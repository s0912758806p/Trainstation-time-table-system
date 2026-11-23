import { describe, expect, it } from 'vitest';
import { directionLabel } from '@/lib/board';
import type { BoardEntry, TrainTypeKey } from '@/lib/types';

const e = (destName: string, type: TrainTypeKey, direction: 0 | 1): BoardEntry => ({
  time: '08:00', depMin: 480, trainNo: '1', type, typeName: '', destName, platform: '1A', delayMin: 0, direction,
});

describe('directionLabel', () => {
  it('prefers express destinations over short commuter runs', () => {
    const entries = [e('中壢', 'qj', 0), e('中壢', 'qj', 0), e('中壢', 'qj', 0), e('高雄', 'zq', 0), e('屏東', 'zq', 0), e('高雄', 'pym', 0)];
    expect(directionLabel(entries, 0)).toBe('往高雄、屏東');
  });

  it('uses commuter destinations when there is no express train', () => {
    expect(directionLabel([e('基隆', 'qj', 1)], 1)).toBe('往基隆');
  });

  it('falls back to 順行／逆行 when a direction is empty', () => {
    expect(directionLabel([], 0)).toBe('順行');
    expect(directionLabel([e('高雄', 'zq', 0)], 1)).toBe('逆行');
  });
});
