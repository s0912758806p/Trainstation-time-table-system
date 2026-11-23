/** 列車識別元件：車次、車種、座位狀態、行程時間軸。 */
import { formatDuration } from '@/lib/format';
import { TRAIN_TYPES } from '@/lib/trainTypes';
import type { SeatStatus, TrainTypeKey } from '@/lib/types';

export function TrainNo({ no, className = '' }: { no: string; className?: string }) {
  return <span className={`trainno ${className}`}>{no}</span>;
}

export function TrainTypeBadge({ type, name, className = '' }: { type: TrainTypeKey; name?: string; className?: string }) {
  return <span className={`tt tt-${type} ${className}`}>{name ?? TRAIN_TYPES[type].label}</span>;
}

const SEAT: Record<SeatStatus, [string, string]> = {
  ok: ['尚有座位', 'st-ok'],
  few: ['座位有限', 'st-warn'],
  none: ['已售完', 'st-bad'],
  free: ['自由座・免訂位', 'st-info'],
};

export function SeatBadge({ seat }: { seat: SeatStatus }) {
  const [label, cls] = SEAT[seat];
  return <span className={`st ${cls}`}>{label}</span>;
}

export function Journey({
  dep, arr, fromName, toName, durationMin, note, size = 28,
}: {
  dep: string; arr: string; fromName?: string; toName?: string; durationMin: number; note?: string; size?: number;
}) {
  return (
    <div className="journey">
      <div>
        <div className="t" style={{ fontSize: size }}>{dep}</div>
        {fromName && <div className="s">{fromName}</div>}
      </div>
      <div className="jline">
        <div className="d">{formatDuration(durationMin)}</div>
        <div className="bar" />
        {note && <div className="s" style={{ fontSize: 12 }}>{note}</div>}
      </div>
      <div style={{ textAlign: 'right' }}>
        <div className="t" style={{ fontSize: size }}>{arr}</div>
        {toName && <div className="s">{toName}</div>}
      </div>
    </div>
  );
}
