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

Other scripts: `npm run build`, `npm start`, `npm run lint`, `npm run typecheck`.

### Environment variables

| Variable | Where | Purpose |
|---|---|---|
| `TDX_CLIENT_ID` / `TDX_CLIENT_SECRET` | server only | TDX OAuth client credentials. Leave empty to use mock data. **Never prefix with `NEXT_PUBLIC_`.** |
| `USE_MOCK` | server only | `true` forces mock data even when keys are set. |

Apply for keys at [TDX 運輸資料流通服務](https://tdx.transportdata.tw/). On Vercel, add them under *Project → Settings → Environment Variables*.

## Data Flow

```
Server Components / Server Actions
        │
   lib/data/index.ts  ── TDX configured? ──yes──▶ lib/tdx (token cache + fetch, revalidate 30s–1d)
        │                     │                         │ any error
        │                     no                        ▼
        └──────────────────────────────────────▶ lib/mock (deterministic timetable)
```

- Every data function returns `{ data, source }`; failures are logged (`[data] … 改用模擬資料`) and fall back to mock data, so pages never break.
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
  format.ts, trainTypes.ts, types.ts, faq.ts, notices.ts, stationInfo.ts
proxy.ts             protects /booking, /orders, /account
```

## License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.

## Author

Gorman
