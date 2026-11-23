import type { Metadata } from 'next';
import { HelpCenter } from '@/components/HelpCenter';

export const metadata: Metadata = { title: '幫助中心' };

export default function HelpPage() {
  return <HelpCenter />;
}
