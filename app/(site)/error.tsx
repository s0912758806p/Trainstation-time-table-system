'use client';

export default function Error({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="wrap pt-10">
      <div role="alert" className="card mx-auto flex max-w-xl flex-col items-center gap-2 p-10 text-center">
        <h1 className="text-xl font-extrabold">暫時無法載入資料</h1>
        <p className="text-muted">可能是網路或資料來源暫時異常，請稍後再試。</p>
        <button type="button" className="btn btn-primary mt-2" onClick={reset}>重新載入</button>
      </div>
    </div>
  );
}
