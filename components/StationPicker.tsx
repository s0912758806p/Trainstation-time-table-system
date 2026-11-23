'use client';
/**
 * 車站選擇器：外觀是設計稿的「field」按鈕，點開後為可搜尋（中／英文）、依地區分組的對話框。
 */
import * as Dialog from '@radix-ui/react-dialog';
import { useMemo, useState } from 'react';
import type { Region, Station } from '@/lib/types';
import { SearchIcon, XIcon } from './icons';

const REGIONS: { key: Region; label: string }[] = [
  { key: 'north', label: '北部' },
  { key: 'central', label: '中部' },
  { key: 'south', label: '南部' },
  { key: 'east', label: '東部' },
];

export function StationPicker({
  label, stations, value, onChange, className = '',
}: {
  label: string;
  stations: Station[];
  value: string;
  onChange: (id: string) => void;
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState('');
  const current = stations.find((s) => s.id === value);

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase().replace(/台/g, '臺');
    if (!term) return null;
    return stations.filter((s) => s.name.includes(term) || s.en.toLowerCase().includes(term) || s.city.includes(term));
  }, [q, stations]);

  const pick = (id: string) => {
    onChange(id);
    setOpen(false);
    setQ('');
  };

  const item = (s: Station) => (
    <li key={s.id}>
      <button type="button" onClick={() => pick(s.id)} aria-current={s.id === value ? 'true' : undefined}
        className={`flex w-full min-h-12 items-center justify-between gap-2 rounded-[10px] px-3 text-left ${s.id === value ? 'bg-primary text-on-primary' : 'hover:bg-subtle'}`}>
        <span className="font-bold">{s.name} <span className="text-[13px] font-medium opacity-75">{s.en}</span></span>
        <span className="text-xs font-semibold opacity-75">{s.grade}</span>
      </button>
    </li>
  );

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <button type="button" className={`field ${className}`} aria-label={`${label}：${current?.name ?? '請選擇'}`}>
          <span className="k">{label}</span>
          <span className="v">{current?.name ?? '請選擇'}</span>
        </button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/40" />
        <Dialog.Content className="card fixed left-1/2 top-[8vh] z-50 flex max-h-[84vh] w-[min(560px,calc(100vw-24px))] -translate-x-1/2 flex-col gap-3 p-4" style={{ boxShadow: 'var(--shadow-lg)' }}>
          <div className="flex items-center justify-between">
            <Dialog.Title className="text-lg font-extrabold">選擇{label}</Dialog.Title>
            <Dialog.Close className="ibtn" style={{ color: 'var(--ink2)' }} aria-label="關閉"><XIcon /></Dialog.Close>
          </div>
          <Dialog.Description className="sr-only">輸入中文或英文站名搜尋，或依地區瀏覽車站。</Dialog.Description>
          <div className="relative">
            <label htmlFor="station-q" className="sr-only">搜尋車站</label>
            <SearchIcon size={18} className="pointer-events-none absolute left-3.5 top-3.5 text-muted" />
            <input id="station-q" className="input pl-10" placeholder="中文或英文站名，例如：臺中、Hualien" value={q} onChange={(e) => setQ(e.target.value)} autoComplete="off" />
          </div>
          <div className="-mx-1 overflow-y-auto px-1">
            {filtered ? (
              filtered.length ? <ul className="grid gap-0.5">{filtered.map(item)}</ul>
                : <p className="py-8 text-center text-muted">找不到「{q}」，請換個關鍵字。</p>
            ) : (
              REGIONS.map((r) => {
                const list = stations.filter((s) => s.region === r.key);
                if (!list.length) return null;
                return (
                  <section key={r.key} className="mb-3">
                    <h3 className="label mb-1 px-3">{r.label}</h3>
                    <ul className="grid gap-0.5 sm:grid-cols-2">{list.map(item)}</ul>
                  </section>
                );
              })
            )}
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
