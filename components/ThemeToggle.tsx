'use client';
import { useSyncExternalStore } from 'react';
import { MoonIcon, SunIcon } from './icons';

type Theme = 'light' | 'dark';

function subscribe(cb: () => void) {
  const mo = new MutationObserver(cb);
  mo.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
  return () => mo.disconnect();
}

const read = (): Theme => (document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light');

export function ThemeToggle({ className = 'ibtn' }: { className?: string }) {
  const theme = useSyncExternalStore(subscribe, read, () => 'light' as Theme);
  const next: Theme = theme === 'dark' ? 'light' : 'dark';
  return (
    <button
      type="button"
      className={className}
      aria-label={next === 'dark' ? '切換為深色模式' : '切換為亮色模式'}
      onClick={() => {
        document.documentElement.dataset.theme = next;
        try {
          localStorage.setItem('ts.theme', next);
        } catch {
          /* 儲存不可用時僅本次有效 */
        }
      }}
    >
      {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
    </button>
  );
}
