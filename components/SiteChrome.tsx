'use client';
/**
 * 站台外框的互動部分：主選單（標示目前頁面）、通知、使用者選單、手機底部分頁列。
 * 外層 TopBar（伺服器元件）把登入狀態傳進來。
 */
import * as Popover from '@radix-ui/react-popover';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut } from '@/app/actions/session';
import { useEffect } from 'react';
import { formatDateLabel } from '@/lib/format';
import { NOTICES, NOTICE_PILL } from '@/lib/notices';
import { ensureSeeded, useOrders } from '@/lib/stores/orders';
import { markNoticesRead, useReadNotices } from '@/lib/stores/prefs';
import { useHydrated } from '@/lib/stores/local';
import { BellIcon, ClockIcon, HomeIcon, TicketIcon, UserIcon } from './icons';

export const NAV = [
  { href: '/', label: '首頁' },
  { href: '/search', label: '時刻查詢' },
  { href: '/stations', label: '車站資訊' },
  { href: '/orders', label: '我的訂單' },
  { href: '/help', label: '幫助中心' },
];

const isActive = (pathname: string, href: string) =>
  href === '/' ? pathname === '/' : pathname === href || pathname.startsWith(`${href}/`) || (href === '/search' && pathname.startsWith('/trains'));

export function NavLinks() {
  const pathname = usePathname();
  return (
    <nav aria-label="主選單" className="hidden md:flex flex-1 flex-wrap gap-0.5">
      {NAV.map((n) => (
        <Link key={n.href} href={n.href} className="navlink" aria-current={isActive(pathname, n.href) ? 'page' : undefined}>
          {n.label}
        </Link>
      ))}
    </nav>
  );
}

export interface SessionInfo {
  name: string;
  guest: boolean;
}

export function Notifications({ member }: { member: boolean }) {
  const hydrated = useHydrated();
  const orders = useOrders();
  const read = useReadNotices();
  useEffect(() => { if (member) ensureSeeded(); }, [member]);

  const pending = member ? orders.filter((o) => o.status === 'pending') : [];
  const unread = NOTICES.filter((n) => !read.includes(n.id)).length + pending.length;
  const label = hydrated && unread > 0 ? `通知，${unread} 則未讀` : '通知';

  return (
    <Popover.Root>
      <Popover.Trigger className="ibtn" aria-label={label}>
        <BellIcon />
        {hydrated && unread > 0 && <span className="dot" />}
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content align="end" sideOffset={8} className="card z-50 w-[min(340px,calc(100vw-24px))] overflow-hidden" style={{ boxShadow: 'var(--shadow-lg)' }}>
          <div className="flex items-center justify-between px-4 py-3 border-b border-line">
            <p className="font-extrabold">通知</p>
            <button type="button" className="btn btn-text btn-sm" onClick={() => markNoticesRead(NOTICES.map((n) => n.id))}>全部標記已讀</button>
          </div>
          <ul className="max-h-[60vh] overflow-y-auto">
            {pending.map((o) => (
              <li key={o.id} className="border-b border-line">
                <Link href="/orders" className="flex gap-3 px-4 py-3 no-underline text-ink hover:bg-subtle">
                  <span className="pill pill-warn shrink-0">待付款</span>
                  <span className="text-sm">
                    <b className="block">{o.trainNo} 次 {o.fromName} → {o.toName}</b>
                    <span className="text-muted">{formatDateLabel(o.date)}・請於 30 分鐘內完成付款</span>
                  </span>
                </Link>
              </li>
            ))}
            {NOTICES.map((n) => {
              const isUnread = !read.includes(n.id);
              return (
                <li key={n.id} className="border-b border-line last:border-0">
                  <Link href="/help" onClick={() => markNoticesRead([n.id])} className={`flex gap-3 px-4 py-3 no-underline text-ink hover:bg-subtle ${isUnread ? 'bg-accent-tint/40' : ''}`}>
                    <span className={`pill ${NOTICE_PILL[n.kind]} shrink-0`}>{n.kind}</span>
                    <span className="text-sm">
                      <b className={`block ${isUnread ? '' : 'font-semibold'}`}>{n.title}</b>
                      <span className="text-muted">{n.body}</span>
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}

export function UserMenu({ session }: { session: SessionInfo | null }) {
  if (!session) {
    return <Link href="/login" className="btn btn-sm ml-1" style={{ background: 'rgb(255 255 255 / .12)', color: 'var(--onnavy)' }}>登入</Link>;
  }
  return (
    <Popover.Root>
      <Popover.Trigger className="avatar ml-1.5 cursor-pointer" aria-label={`會員選單：${session.name}`}>
        {session.name.slice(0, 1).toUpperCase()}
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content align="end" sideOffset={8} className="card z-50 w-56 p-2" style={{ boxShadow: 'var(--shadow-lg)' }}>
          <div className="px-3 py-2">
            <p className="font-extrabold">{session.name}</p>
            <p className="text-xs text-muted">{session.guest ? '訪客模式・僅能查詢' : '一般會員'}</p>
          </div>
          <div className="divider my-1" />
          {session.guest ? (
            <Link href="/login" className="btn btn-text btn-sm w-full justify-start">登入或註冊會員</Link>
          ) : (
            <>
              <Link href="/account" className="btn btn-text btn-sm w-full justify-start">會員中心</Link>
              <Link href="/orders" className="btn btn-text btn-sm w-full justify-start">我的訂單</Link>
            </>
          )}
          <form action={signOut}>
            <button type="submit" className="btn btn-text btn-sm w-full justify-start" style={{ color: 'var(--bad)' }}>登出</button>
          </form>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}

const TABS = [
  { href: '/', label: '首頁', Icon: HomeIcon },
  { href: '/search', label: '時刻', Icon: ClockIcon },
  { href: '/orders', label: '訂單', Icon: TicketIcon },
  { href: '/account', label: '我的', Icon: UserIcon },
];

export function TabBar() {
  const pathname = usePathname();
  return (
    <nav aria-label="主選單" className="tabbar md:hidden fixed inset-x-0 bottom-0 z-40 grid grid-cols-4 border-t border-line bg-surface px-1.5 pt-1.5 pb-[max(10px,env(safe-area-inset-bottom))]">
      {TABS.map(({ href, label, Icon }) => {
        const active = isActive(pathname, href);
        return (
          <Link key={href} href={href} aria-current={active ? 'page' : undefined}
            className={`flex min-h-[52px] flex-col items-center justify-center gap-0.5 rounded-[10px] text-xs font-bold no-underline ${active ? 'text-primary' : 'text-muted'}`}>
            <Icon size={22} />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
