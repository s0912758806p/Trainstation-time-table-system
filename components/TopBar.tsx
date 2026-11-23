import Link from 'next/link';
import { getSession } from '@/lib/session';
import { tdxConfigured } from '@/lib/tdx/client';
import { TrainIcon } from './icons';
import { NavLinks, Notifications, UserMenu } from './SiteChrome';
import { ThemeToggle } from './ThemeToggle';

export async function TopBar() {
  const session = await getSession();
  return (
    <header className="topbar sticky top-0 z-40">
      <div className="wrap flex min-h-16 items-center gap-6">
        <Link className="brand" href="/" aria-label="台鐵時刻 首頁">
          <span className="brand-mark"><TrainIcon /></span>
          <span><b>台鐵時刻</b><small>TRAIN TIMETABLE</small></span>
        </Link>
        <NavLinks />
        <div className="ml-auto flex items-center gap-0.5">
          <ThemeToggle />
          <Notifications member={!!session && !session.guest} />
          <UserMenu session={session ? { name: session.name, guest: session.guest } : null} />
        </div>
      </div>
    </header>
  );
}

export function Footer() {
  const source = tdxConfigured() ? 'tdx' : 'mock';
  return (
    <footer className="wrap pt-7 pb-28 md:pb-9 text-[13px] text-muted">
      {source === 'tdx'
        ? '時刻資料來源：交通部 TDX 運輸資料流通服務。訂票與訂單為展示用模擬流程。'
        : '本系統使用模擬資料，僅供展示，非官方訂票系統。'}
      {' · '}© {new Date().getFullYear()} 台鐵時刻
    </footer>
  );
}
