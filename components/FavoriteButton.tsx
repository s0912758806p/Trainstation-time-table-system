'use client';
import { toggleFavorite, useFavorites, type RoutePref } from '@/lib/stores/prefs';
import { StarIcon } from './icons';

export function FavoriteButton({ route }: { route: RoutePref }) {
  const favs = useFavorites();
  const on = favs.some((f) => f.fromId === route.fromId && f.toId === route.toId);
  return (
    <button type="button" className="btn btn-ghost btn-sm" aria-pressed={on} onClick={() => toggleFavorite(route)}>
      <StarIcon size={16} filled={on} style={{ color: on ? 'var(--accent)' : undefined }} />
      {on ? '已加入常用' : '加入常用'}
    </button>
  );
}
