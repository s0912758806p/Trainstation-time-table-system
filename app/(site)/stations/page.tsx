import { redirect } from 'next/navigation';
import { DEFAULT_FROM } from '@/lib/constants';

export default function StationsIndex() {
  redirect(`/stations/${DEFAULT_FROM}`);
}
