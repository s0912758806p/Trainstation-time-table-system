'use client';
/**
 * 登入／註冊（模擬）：任何電子郵件與 8 碼以上密碼皆可登入；密碼不會被傳送或保存。
 * 服務條款與隱私權政策以對話框呈現，不會離開頁面而遺失已填資料。
 */
import * as Dialog from '@radix-ui/react-dialog';
import { startTransition, useState } from 'react';
import { signIn } from '@/app/actions/session';
import { XIcon } from './icons';

type Tab = 'login' | 'register';

export function LoginForm({ next, initialTab }: { next: string; initialTab: Tab }) {
  const [tab, setTab] = useState<Tab>(initialTab);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [agree, setAgree] = useState(false);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [forgot, setForgot] = useState(false);
  const blocked = next.startsWith('/booking') || next.startsWith('/orders') || next.startsWith('/account');

  const go = (body: { name?: string; email?: string; guest?: boolean }) => {
    setBusy(true);
    startTransition(async () => {
      const res = await signIn({ ...body, next });
      if (res?.error) {
        setError(res.error);
        setBusy(false);
      }
    });
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (tab === 'register' && !name.trim()) return setError('請輸入姓名');
    if (!/^\S+@\S+\.\S+$/.test(email)) return setError('請輸入有效的電子郵件');
    if (password.length < 8) return setError('密碼至少需要 8 個字元');
    if (tab === 'register' && !agree) return setError('請先閱讀並同意服務條款與隱私權政策');
    go({ name: name.trim(), email: email.trim() });
  };

  return (
    <div className="flex w-full max-w-[400px] flex-col gap-5">
      {blocked && <p className="rounded-xl bg-warn-bg px-4 py-3 text-sm font-semibold text-warn">訂票與查看訂單需要先登入會員。</p>}
      <div className="grid grid-cols-2 border-b border-line" role="tablist" aria-label="登入或註冊">
        {(['login', 'register'] as Tab[]).map((t) => (
          <button key={t} role="tab" type="button" aria-selected={tab === t} onClick={() => { setTab(t); setError(''); }}
            className={`min-h-12 border-b-[3px] text-base font-extrabold ${tab === t ? 'border-accent text-ink' : 'border-transparent text-muted'}`}>
            {t === 'login' ? '登入' : '註冊'}
          </button>
        ))}
      </div>

      <form onSubmit={submit} noValidate className="flex flex-col gap-4">
        {tab === 'register' && (
          <div><label className="flabel" htmlFor="rn">姓名</label><input id="rn" className="input" autoComplete="name" placeholder="例如：王小明" value={name} onChange={(e) => setName(e.target.value)} /></div>
        )}
        <div><label className="flabel" htmlFor="em">電子郵件</label><input id="em" type="email" className="input" autoComplete="email" placeholder="name@example.com" value={email} onChange={(e) => setEmail(e.target.value)} /></div>
        <div>
          <div className="flex items-baseline justify-between">
            <label className="flabel" htmlFor="pw">{tab === 'login' ? '密碼' : '設定密碼'}</label>
            {tab === 'login' && <button type="button" className="text-[13px] font-semibold text-link" onClick={() => setForgot(true)}>忘記密碼？</button>}
          </div>
          <input id="pw" type="password" className="input" autoComplete={tab === 'login' ? 'current-password' : 'new-password'} placeholder="至少 8 個字元" value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        {tab === 'register' && (
          <label className="flex items-start gap-2.5 text-sm">
            <input type="checkbox" className="mt-0.5 h-[18px] w-[18px] accent-[var(--primary)]" checked={agree} onChange={(e) => setAgree(e.target.checked)} />
            <span>我已閱讀並同意 <TermsDialog title="服務條款" /> 與 <TermsDialog title="隱私權政策" /></span>
          </label>
        )}
        {error && <p role="alert" className="text-sm font-bold" style={{ color: 'var(--bad)' }}>{error}</p>}
        <button type="submit" className="btn btn-primary btn-lg" disabled={busy}>{busy ? '處理中…' : tab === 'login' ? '登入' : '建立帳號'}</button>
      </form>

      <div className="flex items-center gap-3 text-[13px] font-semibold text-muted before:h-px before:flex-1 before:bg-line after:h-px after:flex-1 after:bg-line">或</div>
      <button type="button" className="btn btn-ghost btn-lg" disabled={busy} onClick={() => go({ guest: true })}>以訪客身分瀏覽</button>
      <p className="text-center text-[13px] text-muted">訪客可查詢時刻與票價，訂票需登入會員。</p>

      <Dialog.Root open={forgot} onOpenChange={setForgot}>
        <Modal title="忘記密碼">
          <p className="text-ink2">這是展示系統，不保存任何密碼。直接輸入電子郵件與任一 8 碼以上密碼即可登入。</p>
        </Modal>
      </Dialog.Root>
    </div>
  );
}

function Modal({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <Dialog.Portal>
      <Dialog.Overlay className="fixed inset-0 z-50 bg-black/40" />
      <Dialog.Content className="card fixed left-1/2 top-1/2 z-50 flex w-[min(480px,calc(100vw-32px))] -translate-x-1/2 -translate-y-1/2 flex-col gap-3 p-6" style={{ boxShadow: 'var(--shadow-lg)' }}>
        <div className="flex items-center justify-between">
          <Dialog.Title className="text-lg font-extrabold">{title}</Dialog.Title>
          <Dialog.Close className="ibtn" style={{ color: 'var(--ink2)' }} aria-label="關閉"><XIcon /></Dialog.Close>
        </div>
        <Dialog.Description asChild><div className="flex flex-col gap-2 text-sm">{children}</div></Dialog.Description>
      </Dialog.Content>
    </Dialog.Portal>
  );
}

function TermsDialog({ title }: { title: string }) {
  return (
    <Dialog.Root>
      <Dialog.Trigger className="font-bold text-link">{title}</Dialog.Trigger>
      <Modal title={title}>
        <p className="text-ink2">本系統為個人作品集展示用途，所有時刻、訂單與付款皆為模擬，不構成任何交易或契約。</p>
        <p className="text-ink2">您輸入的姓名與電子郵件只保存在瀏覽器 cookie 與 localStorage 中，不會傳送到第三方；清除瀏覽資料即可刪除。</p>
      </Modal>
    </Dialog.Root>
  );
}
