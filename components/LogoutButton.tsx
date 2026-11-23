'use client';
import { signOut } from '@/app/actions/session';

export function LogoutButton() {
  return (
    <form action={signOut}>
      <button type="submit" className="btn btn-danger">登出</button>
    </form>
  );
}
