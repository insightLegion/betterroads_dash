# Better Roads — Mumbai

A civic-tech investor demo that makes Mumbai road conditions publicly visible, historically trackable, and authority-accountable. Desktop-only single-page app built with Vite + React + Leaflet + Recharts.

## Run locally

```bash
npm install
npm run dev
```

Then open http://localhost:5173 in a desktop browser.

## Screens

- **Map** — 6 Mumbai wards with a severity-coded OpenStreetMap overlay, a search bar, three data layers (Condition, Complaints, History 6mo), and a detail side panel with score card, 12-month history chart, events timeline, and the authority accountability chain.
- **Compare** — pick two months from the same area and see a draggable before/after road diagram, metric cards, event comparison table, an auto-generated insight paragraph, and a clickable 12-month timeline strip.
- **File Complaint** — 3-step wizard (Road → Details → Review) that assembles a signed, CC-ed complaint letter to the ward office with the state PWD in CC, plus a sticky filing panel showing the escalation path and per-area complaint stats.

## Deploy to Vercel

```bash
npx vercel
```

Accept the defaults when prompted:

- **Framework:** Vite (auto-detected)
- **Build command:** `npm run build`
- **Output directory:** `dist`
- **Root directory:** `./`

After the first deploy, replace the placeholder URL below.

```
// Replace with Vercel URL after first deploy
```

## Stack

- Vite 8 + React 18
- `leaflet` + `react-leaflet` for the map
- `recharts` for the 12-month history chart
- No routing library — a React context switches between screens
- No UI framework — all visual styling lives in `src/styles/tokens.css` and inline styles. Font weights are 400 / 500 only; no gradients; shadows reserved for floating cards.
