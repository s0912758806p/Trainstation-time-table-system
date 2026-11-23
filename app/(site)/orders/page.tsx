import type { Metadata } from 'next';
import { Suspense } from 'react';
import { OrdersView } from '@/components/OrdersView';

export const metadata: Metadata = { title: '我的訂單' };

export default function OrdersPage() {
  return (
    <Suspense>
      <OrdersView />
    </Suspense>
  );
}
