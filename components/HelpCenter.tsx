'use client';
/** 幫助中心：分類篩選、全文搜尋（問題＋答案）、無結果提示。 */
import Link from 'next/link';
import { useState } from 'react';
import { FAQ } from '@/lib/faq';
import { SearchIcon } from './icons';

export function HelpCenter() {
  const [cat, setCat] = useState(FAQ[0].key);
  const [q, setQ] = useState('');
  const term = q.trim().replace(/台/g, '臺');
  const results = term
    ? FAQ.flatMap((c) => c.items.filter((i) => i.q.includes(term) || i.a.includes(term)).map((i) => ({ ...i, cat: c.name })))
    : null;
  const current = FAQ.find((c) => c.key === cat)!;

  return (
    <>
      <section className="bg-navy pt-10 pb-12 text-onnavy">
        <div className="wrap flex max-w-[760px] flex-col gap-3.5 text-center">
          <h1 className="text-[32px] font-black">需要什麼協助？</h1>
          <div className="relative">
            <label htmlFor="fq" className="sr-only">搜尋常見問題</label>
            <SearchIcon size={20} className="pointer-events-none absolute left-4 top-[18px] text-muted" />
            <input id="fq" type="search" className="input h-14 border-0 pl-12 text-base" placeholder="輸入關鍵字，例如：退票手續費、孩童票" value={q} onChange={(e) => setQ(e.target.value)} />
          </div>
          <p className="text-[13px] text-onnavy2">搜尋範圍包含問題與解答內容</p>
        </div>
      </section>

      <div className="wrap flex flex-col gap-6 pt-7">
        {!results && (
          <div className="grid grid-cols-2 gap-3 md:grid-cols-3" role="group" aria-label="問題分類">
            {FAQ.map((c) => (
              <button key={c.key} type="button" aria-pressed={cat === c.key} onClick={() => setCat(c.key)}
                className={`flex min-h-[76px] flex-col items-start gap-0.5 rounded-[14px] border bg-surface px-4 py-3.5 text-left ${cat === c.key ? 'border-primary shadow-[inset_0_0_0_2px_var(--primary)]' : 'border-line hover:border-muted'}`}>
                <b className="text-base">{c.name}</b>
                <span className="text-[13px] text-muted">{c.desc}・{c.items.length} 題</span>
              </button>
            ))}
          </div>
        )}

        <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
          <section className="card px-5 pt-2 pb-3 sm:px-6" aria-label="常見問題">
            <div className="sec-head pt-3 pb-1">
              <h2 className="h-sec" aria-live="polite">{results ? `「${q}」的搜尋結果` : current.name}</h2>
              <span className="num text-[13px] text-muted">{(results ?? current.items).length} 個問題</span>
            </div>
            {(results ?? current.items).map((i) => (
              <details key={i.q} className="group border-t border-line first-of-type:border-0">
                <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-3 font-bold [&::-webkit-details-marker]:hidden">
                  <span>{i.q}{'cat' in i && <span className="ml-2 text-xs font-semibold text-muted">{(i as { cat: string }).cat}</span>}</span>
                  <span aria-hidden="true" className="text-[22px] font-medium text-muted group-open:hidden">+</span>
                  <span aria-hidden="true" className="hidden text-[22px] font-medium text-muted group-open:inline">−</span>
                </summary>
                <p className="pb-4 text-[15px] text-ink2">{i.a}</p>
              </details>
            ))}
            {results?.length === 0 && (
              <div className="flex flex-col items-center gap-2 py-8 text-center">
                <p className="font-extrabold">找不到相關問題</p>
                <p className="text-muted">換個關鍵字，或透過右側管道聯絡我們。</p>
                <button type="button" className="btn btn-ghost mt-1" onClick={() => setQ('')}>清除搜尋</button>
              </div>
            )}
          </section>

          <aside className="flex flex-col gap-4">
            <section className="card flex flex-col gap-3 p-5">
              <h2 className="h-sec">找不到答案？</h2>
              <p className="text-sm text-muted">這是展示專案，沒有真人客服。問題回報請至專案的 GitHub Issues。</p>
              <a className="btn btn-primary" href="https://github.com/s0912758806p/Trainstation-time-table-system/issues" target="_blank" rel="noopener noreferrer">回報問題</a>
            </section>
            <section className="card flex flex-col gap-1 p-5">
              <h2 className="h-sec mb-1 text-base">快速連結</h2>
              <Link className="btn btn-text btn-sm justify-start px-0" href="/orders">查詢／取消我的訂單</Link>
              <Link className="btn btn-text btn-sm justify-start px-0" href="/stations">車站設施與轉乘</Link>
              <Link className="btn btn-text btn-sm justify-start px-0" href="/search">時刻查詢</Link>
            </section>
          </aside>
        </div>
      </div>
    </>
  );
}
