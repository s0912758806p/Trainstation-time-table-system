import type { Metadata, Viewport } from 'next';
import { Inter, JetBrains_Mono, Noto_Sans_TC } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' });
const noto = Noto_Sans_TC({ weight: ['400', '500', '700', '900'], subsets: ['latin'], variable: '--font-noto-tc', display: 'swap', preload: false });
const mono = JetBrains_Mono({ weight: ['500', '700'], subsets: ['latin'], variable: '--font-jetbrains', display: 'swap' });

export const metadata: Metadata = {
  title: { default: '台鐵時刻｜時刻查詢與線上訂票', template: '%s｜台鐵時刻' },
  description: '查詢臺鐵列車時刻、比較車種與票價，線上完成訂票。本系統為展示用途，預設使用模擬資料。',
  applicationName: '台鐵時刻',
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#0b2545' },
    { media: '(prefers-color-scheme: dark)', color: '#060d18' },
  ],
};

/** 在第一次繪製前套用主題，避免深色模式閃白 */
const themeScript = `(function(){try{var t=localStorage.getItem('ts.theme');if(t!=='light'&&t!=='dark'){t=matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light'}document.documentElement.dataset.theme=t}catch(e){}})()`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-Hant" suppressHydrationWarning className={`${inter.variable} ${noto.variable} ${mono.variable}`}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
