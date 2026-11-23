import type { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { LogoutButton } from '@/components/LogoutButton';
import { MemberStats } from '@/components/HomeWidgets';
import { ThemeToggle } from '@/components/ThemeToggle';
import { getSession } from '@/lib/session';

export const metadata: Metadata = { title: '會員中心' };

export default async function AccountPage() {
  const session = await getSession();
  if (!session || session.guest) redirect('/login?next=/account');

  return (
    <div className="wrap flex max-w-[860px] flex-col gap-5 pt-6">
      <h1 className="text-[26px] font-black">會員中心</h1>
      <section className="card flex flex-wrap items-center gap-4 p-5 sm:p-6">
        <span className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-primary text-2xl font-black text-on-primary" aria-hidden="true">
          {session.name.slice(0, 1).toUpperCase()}
        </span>
        <div className="flex-1">
          <p className="text-xl font-extrabold">{session.name}</p>
          <p className="text-sm text-muted">{session.email}・一般會員</p>
        </div>
        <LogoutButton />
      </section>
      <MemberStats />
      <section className="card flex flex-col divide-y divide-line px-5 sm:px-6">
        <Link href="/orders" className="flex min-h-14 items-center justify-between font-bold text-ink no-underline">我的訂單<span className="text-muted">›</span></Link>
        <div className="flex min-h-14 items-center justify-between font-bold">深色模式<ThemeToggle className="ibtn !text-ink2" /></div>
        <Link href="/help" className="flex min-h-14 items-center justify-between font-bold text-ink no-underline">幫助中心<span className="text-muted">›</span></Link>
      </section>
      <p className="text-[13px] text-muted">帳號為模擬資料：姓名與電子郵件只保存在這個瀏覽器的 cookie 中。</p>
    </div>
  );
}
