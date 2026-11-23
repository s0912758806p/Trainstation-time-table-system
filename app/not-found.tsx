import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="wrap flex min-h-[70dvh] flex-col items-center justify-center gap-3 text-center">
      <p className="font-mono text-5xl font-bold" style={{ color: 'var(--accent)' }}>404</p>
      <h1 className="text-2xl font-black">這個月台沒有列車</h1>
      <p className="text-muted">您要找的頁面不存在，可能已移除或網址有誤。</p>
      <Link className="btn btn-primary mt-2" href="/">回到首頁</Link>
    </main>
  );
}
