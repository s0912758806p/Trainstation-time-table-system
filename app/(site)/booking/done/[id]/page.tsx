import type { Metadata } from 'next';
import { BookingDone } from '@/components/BookingDone';

export const metadata: Metadata = { title: '訂位成功' };

export default async function DonePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <BookingDone id={id} />;
}
