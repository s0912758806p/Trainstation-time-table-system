import { TabBar } from '@/components/SiteChrome';
import { Footer, TopBar } from '@/components/TopBar';

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-3 focus:top-3 focus:z-50 btn btn-primary">跳到主要內容</a>
      <TopBar />
      <main id="main">{children}</main>
      <Footer />
      <TabBar />
    </>
  );
}
