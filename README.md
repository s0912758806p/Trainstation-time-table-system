# Trainstation Time Table System（台鐵時刻）

A Taiwan Railway (TRA) timetable and booking demo built with **Next.js 16 (App Router)**.
Search trains between stations, inspect a train's stops on a route timeline, book seats, and manage orders — on desktop and mobile, in light or dark mode.

**Demo:** [Live Demo](https://trainstation-time-table-gr925.vercel.app)
**Design:** the UI follows the Claude Design canvas *台鐵時刻 · Redesign* (railway identity: navy board, signal-orange accent, departure-board results, route-line timeline).

> This is a portfolio project, not an official TRA service. Timetables come from the TDX open-data API when keys are configured and fall back to deterministic mock data otherwise. Accounts, bookings and payments are always simulated.

## Features

- **Timetable search** by origin/destination (with swap, date strip, departure-time filter) or by train number
- **Results** with train-type / time-of-day / service filters and sort by departure, duration or fare
- **Train detail** with a stop timeline that highlights your segment, fares per ticket type
- **Booking flow**: passengers per ticket type, seat preference, contact → order with a 30-minute payment window
- **My orders**: status tabs (待付款 / 已付款 / 已完成 / 已退款 / 已取消), search, pay, cancel, refund, print
- **Stations**: searchable list by region, live departures board, transfers and facilities
- **Help center**: categorized FAQ with full-text search (questions and answers)
- **Mock auth**: member login / register / guest mode; booking and orders require a member session
- Light / dark themes (no flash on load), responsive layout with a mobile bottom tab bar, keyboard and screen-reader friendly controls

## Tech Stack

- Next.js 16 (App Router, Server Components, Server Actions, `proxy.ts` route guard)
- React 19, TypeScript (strict)
- Tailwind CSS 4 with design tokens as CSS variables (`app/globals.css`)
- Radix UI (Dialog, Popover) for accessible overlays
- TDX (Transport Data eXchange) API, server-side only

## Getting Started

Requires Node.js 20.9+.

```bash
npm install
cp .env.example .env.local   # optional: add TDX keys
npm run dev                  # http://localhost:3000
```

Other scripts: `npm run build`, `npm start`, `npm run lint`, `npm run typecheck`, `npm test`, `npm run test:watch`, `npm run test:e2e`.

### Environment variables

| Variable | Where | Purpose |
|---|---|---|
| `TDX_CLIENT_ID` / `TDX_CLIENT_SECRET` | server only | TDX OAuth client credentials. Leave empty to use mock data. **Never prefix with `NEXT_PUBLIC_`.** |
| `USE_MOCK` | server only | `true` forces mock data even when keys are set. |

Apply for keys at [TDX 運輸資料流通服務](https://tdx.transportdata.tw/). On Vercel, add them under *Project → Settings → Environment Variables*.

`vercel.json` pins the framework to Next.js so an older *Vite* preset in the Vercel dashboard can't override the build output.

## Testing

```bash
npm test             # Vitest, run once
npm run test:watch   # re-run on change
```

Unit tests live in `test/` and need no TDX keys or browser:

- **Data fallback** (`test/data-fallback.test.ts`): TDX failures, empty lists, malformed records and missing trains fall back to mock data. A missing fare is filled in with a distance estimate.
- **TDX client and mappers**: token caching, `USE_MOCK`, HTTP errors, midnight-crossing timetables, fare picking.
- **Mock timetable**: determinism, search order, fares, and board directions (regression for PR #5).
- **Orders store**: id sequence, 30-minute pay window, expiry, refund/cancel, unavailable `localStorage`.
- **Auth**: the `proxy.ts` route guard and session parsing.
- **Docs freshness** (`test/docs-freshness.test.ts`): this README's scripts, environment variables, Node version and workflow list must match `package.json`, `.env.example`, the code and `.github/workflows/`. Update the README in the same change, or the test fails.

### End-to-end tests (Playwright)

```bash
npx playwright install chromium   # first time only
npm run test:e2e                  # builds, starts on :3100 with USE_MOCK=true, runs Chromium
```

Specs live in `e2e/` and drive a real browser against the production build, in the Asia/Taipei time zone:

- **Search** (`e2e/search.spec.ts`): station picker (including 台→臺), swap, same-station error, quick dates, search by train number, results → train detail.
- **Booking** (`e2e/booking.spec.ts`): signed out → login → back to booking → add passenger → book → pay → my orders (survives reload) → refund. Also form validation and cancelling a pending order.
- **Site** (`e2e/site.spec.ts`): route guard and guest mode (no redirect loop), login validation, dark mode persisting across reload, station board, help search, 404 pages.
- **Mobile** (`e2e/layout.mobile.spec.ts`, Pixel 7): no horizontal scroll on key pages; bottom tab bar navigation.

`/trains/<invalid>` shows the 404 page with status 200 plus a `noindex` tag, because `(site)/loading.tsx` streams the page before `notFound()` runs. This is standard Next.js behaviour, and the spec checks for it. On CI failures, download the `playwright-report` artifact from the run.

## Branching & Deployment

```
feature branch ──(Auto Pull Request)──▶ PR to dev ──(manual merge)──▶ dev
dev ──(Dev to Release: auto PR + merge)──▶ release   → Vercel Preview
release ──(manual PR + merge)──▶ main                → Vercel Production
```

Workflows in `.github/workflows/`:

| File | Runs on | What it does |
|---|---|---|
| `ci.yml` | push to any branch except `dev`, fork PRs, manual | lint, typecheck, `npm test`, `npm run build`, `npm run test:e2e` (mock data, no keys needed) |
| `auto-pull-request.yml` | push to a feature branch | opens the PR to `dev` if none exists |
| `dev-to-release.yml` | push to `dev`, manual | runs `ci.yml` first; only if it passes, opens and merges the `dev` → `release` PR |

- All workflows use the built-in `GITHUB_TOKEN`, so no personal access token is needed. Requirement: *Settings → Actions → General → Allow GitHub Actions to create and approve pull requests* must be enabled.
- PRs and merges made with `GITHUB_TOKEN` don't trigger other workflows; Vercel deploys through its GitHub app, so it is unaffected.
- Add `[skip-release]` to a commit message on `dev` to skip the automatic release merge. The release workflow can also be run manually (*Actions → Dev to Release → Run workflow*).

## Data Flow

```
Server Components / Server Actions
        │
   lib/data/index.ts  ── TDX configured? ──yes──▶ lib/tdx (token cache + fetch, revalidate 30s–1d)
        │                     │                         │ any error
        │                     no                        ▼
        └──────────────────────────────────────▶ lib/mock (deterministic timetable)
```

- Every data function returns `{ data, source }`. **Whatever TDX can't provide comes from mock data**, so pages never break:
  - The whole record falls back (`source: 'mock'`, logged as `[data] … 改用模擬資料`) when TDX errors, returns an empty list or malformed records, or doesn't have the requested train, trip or station.
  - Single missing fields are filled in while `source` stays `'tdx'`: a missing fare is estimated from mock-network distance, and seat availability (which TDX doesn't publish) always uses the mock value.
- TDX endpoint paths live in `lib/tdx/client.ts` (`TDX_PATHS`). The token endpoint is verified; the timetable, fare and live-board paths follow the TDX v3 Rail/TRA docs and should be checked against the TDX Swagger once you have keys. Fare mapping (`pickFare`) is a heuristic until then.
- Mock timetables are deterministic: the same train number always has the same type and stops; seat availability and delays are seeded by train number + date.
- Orders, recent searches, favourites and read notices are stored in the browser's `localStorage` (`lib/stores`). The session is a `ts_session` cookie set by Server Actions in `app/actions/session.ts`.

## Project Structure

```
app/
  (site)/            pages with the top bar + mobile tab bar
    page.tsx         home: search, departures board, next trip, favourites, notices
    search/          results for ?from&to&date&after
    trains/[no]/     train detail (?date&from&to)
    booking/         booking form; booking/done/[id] confirmation
    orders/          my orders
    stations/[id]/   station info
    help/            help center
    account/         member center
  login/             login / register / guest
  actions/session.ts mock sign-in / sign-out (Server Actions)
  globals.css        design tokens (light/dark) + component classes
components/          TopBar, SiteChrome, SearchForm, StationPicker, ResultsList, DepartureBoard, BookingForm, OrdersView, …
lib/
  data/              data access facade (TDX → mock fallback)
  tdx/               TDX client and response mappers
  mock/              mock network (stations, lines, service templates) and timetable generator
  stores/            localStorage-backed client stores (orders, prefs)
  board.ts           departure-board helpers (direction labels)
  format.ts, trainTypes.ts, types.ts, faq.ts, notices.ts, stationInfo.ts
proxy.ts             protects /booking, /orders, /account
test/                Vitest unit tests (see Testing)
e2e/                 Playwright end-to-end specs
```

## License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.

## Author

Gorman
