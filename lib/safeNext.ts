/**
 * 登入後要導回的路徑（?next=）只接受本站路徑，防止開放式重新導向（open redirect）。
 * 擋下：外部網址、//host、/\host（瀏覽器會把反斜線當成斜線）、控制字元。
 */
const BASE = 'http://same-origin.invalid';

export function safeNext(next: string | null | undefined): string {
  if (!next || !next.startsWith('/') || /[\\\u0000-\u001f\u007f]/.test(next)) return '/';
  try {
    const url = new URL(next, BASE);
    return url.origin === BASE ? url.pathname + url.search + url.hash : '/';
  } catch {
    return '/';
  }
}
