  # Better Roads — map fix, and what to finish before 15 August

**Date:** 2026-08-08 · **Branch:** `fix/real-road-geometry` · **Base:** `3f1d329`
**Scope:** the road-overlay bug the team reported, plus a readiness review of the demo as it stands.

---

## 1. What was wrong, and what changed

The reported symptom — *"we're getting straight lines as overlay"* — was not a styling problem. The
road overlays were **generated rather than sourced**.

`src/screens/map/RoadSegments.jsx` (before this branch) placed every road on a circle around its
ward centroid:

```js
const RADIUS = 0.009;        // ~1 km from centroid
const SEGMENT_HALF = 0.004;  // ~440 m half-length
const angle = (index / count) * Math.PI * 2 + (index * 0.3); // jitter
```

Every road was a two-point line at a computed angle. It could never lie on a street, because no
street geometry was ever loaded. `WardPolygons.jsx:3-15` does the same thing for wards — they are
`0.028°` squares, and its own comment says so: *"Real BMC ward GeoJSON is Phase 2+."*

**The fix keeps the entire stack — React, Leaflet, react-leaflet, the layer chips, the scrubber.**
Nothing was re-architected. Only the geometry source changed.

| | Before | After |
|---|---|---|
| Road shape | 2-point line at a computed angle | real OpenStreetMap way geometry |
| Roads drawn | 30 (all synthetic) | 25 real · 5 explicitly unavailable |
| Vertices on screen | 2 per road | up to 114 per road (measured in-page) |
| OSM credit | never rendered | visible bottom-right |

**New file — `scripts/fetch-osm-roads.mjs`.** Queries Overpass for named highways within 3 km of each
ward centroid (widening to 8 km for misses), matches them to the road names in `areas.js`, and bakes
the geometry to `src/data/roadGeometry.json` (78 KB, committed). Raw responses cache under
`scripts/.osm-cache/` (gitignored) so re-running the matcher costs no API calls.

```bash
node scripts/fetch-osm-roads.mjs   # only needed when areas.js road names change
npm install && npm run dev         # http://localhost:5173
```

### The detail that took the match rate from 19/30 to 25/30

Mumbai's OSM data records renamed roads as **`Official Marg (Colloquial Road)`**:

| `areas.js` says | OSM actually stores |
|---|---|
| Turner Road | `Gurunanak Marg (Turner Road)` |
| Waterfield Road | `RK Patkar Marg (Waterfield Road)` |
| Andheri-Kurla Road | `Mathuradas Vasanji Road (Andheri Kurla Road)` |
| Cadell Road | `Swatantrya Veer Savarkar Marg` *(no parenthetical — renamed outright)* |

The matcher now indexes every way under its full name **and** both halves of the parenthetical. If
you add roads to `areas.js`, expect to add an alias; the script prints exactly which labels failed.

### Five roads have no geometry, and they are not drawn

`roadGeometry.json` records them as `null`, and `RoadSegments.jsx` skips them. **This is deliberate.**
A guessed straight line between two plausible points is worse than an absent road — it looks exactly
like the bug being fixed, so it would hide a regression rather than reveal one.

| Road | Ward in `areas.js` | Finding |
|---|---|---|
| Telang Road | Vile Parle | **Wrong ward** — OSM has `Telang Road` in Dadar, not Vile Parle |
| Hanuman Road | Vile Parle | not in OSM within 8 km; nearest is `Hanuman Mandir Road` |
| Pali Hill Road | Bandra West | not an OSM road name; Pali Hill streets carry other names |
| Nehru Nagar Road | Kurla | nearest is `Nehru Nagar Police Station Marg` |
| Sion-Kurla Road | Kurla | not found under that name within 8 km |

Two of these are data errors in `areas.js`, not gaps in OSM. Worth correcting the source list
rather than forcing a match.

---

## 2. Before 15 August — ranked

### 2.1 The demo attributes fabricated tenders to real, named companies — fix this first

This is the highest-risk item in the repository and it is not the map.

`src/data/areas.js` defines eight **real, listed Indian infrastructure companies**:

> J Kumar Infraprojects Ltd · IRB Infrastructure Developers · ITD Cementation India Ltd ·
> Relcon Infraprojects Ltd · NCC Limited (Nagarjuna) · Afcons Infrastructure Ltd ·
> Roadway Solutions India Ltd · Ashoka Buildcon Ltd

`getRoadDetails()` assigns one to each road **by hash**, together with a fabricated tender ID
(`BMC/RD/GSW/2024-092`), a fabricated amount (`₹2.40–27.60 Cr`), fabricated contract dates, and a
progress bar. `src/data/pwd.js` names a **real PWD minister and a real Additional Chief Secretary**
with real-looking government email addresses, and `areas.js` names a ward officer.

The screen then renders that next to *"Severe"*, *"BMC 14-day SLA exceeded by 54 days"*, and
*"Repair started: Not yet"*.

So a publicly reachable page states, in effect, that a named listed company holds a named contract on
a road it has failed to repair for 54 days. **None of it is real.** For a product whose entire pitch is
*accountability*, publishing invented accountability records against real parties is both a legal
exposure in India and the fastest way to lose the argument with BMC.

**Fix (about 30 minutes, no architecture change):**

1. Replace the eight contractor names with obvious fictions — `Contractor A (demo)`, or invented names
   that cannot be mistaken for real firms. Same for the minister, the ACS, and the ward officer.
2. Keep the real **ward emails and phone numbers** — those are published public-contact data and are
   the honest part of the complaint flow.
3. Put a persistent, non-dismissible label on the map screen: **"Demonstration data — road conditions,
   scores and tenders are illustrative and not measured."** One line, always visible, not a footnote.
4. Remove *"Last surveyed 2 days ago"* until something is actually surveyed.

Everything else on this list is optional. This one is not.

### 2.2 15 August is not reachable on Google Play production — but the demo does not need it

A **personal** Play developer account created after 2023-11-13 must run a closed test with **12+
testers opted in continuously for 14 days** before it may even *apply* for production access. As of
2026-08-08 the date is **7 days out**, and 7 < 14. No amount of finished code changes that.

Three things make this a non-issue if handled now:

- **Organisation accounts** registered to a legal entity are **exempt** from the requirement.
- **Testing tracks** (internal/closed/open) have **no such gate**.
- **Web and PWA have no gate at all** — and this demo is already a web app.

**Action:** confirm which account type Akashraj's team holds and when closed testing started. If it is
a personal account started recently, launch 15 August as **web + open testing track**, not production
Play. The date survives; only the channel changes. *(Source: Google Play console policy on new
personal developer accounts; verify against the team's own console before committing publicly.)*

### 2.3 `tile.openstreetmap.org` is not a production tile host

The app now correctly credits OpenStreetMap, which it previously did not — `MapView.jsx` had
`attributionControl={false}` set alongside an `attribution` string, so the credit rendered nowhere.
That is fixed on this branch.

The remaining issue is the tile **server**. OSMF's Tile Usage Policy explicitly excludes production
applications from the public `tile.openstreetmap.org` endpoint. It is fine for a demo in front of a
room; it is not fine for a launch that hopes for traffic.

**Action before any public push:** move to a tile host with a free tier and a key
(several offer one), or self-host. This is a one-line URL change in `MapView.jsx` — do it as a config
value now so it is not a code change under pressure later.

Related, and worth deciding early rather than late: joining road-condition data onto OSM geometry
produces a **Derived Database under ODbL**, which carries share-alike obligations on request. Better
Roads has already committed publicly to being open source, so this is aligned — but it is now a
technical constraint with a licence attached, not only a philosophy.

---

## 3. Polish, ranked by value per hour

| # | Item | Why | Effort |
|---|---|---|---|
| 1 | Fix the 2 mis-filed roads in `areas.js` (Telang → Dadar) and drop or rename the other 3 | 5 roads currently vanish from the map with no explanation | 20 min |
| 2 | Show unavailable roads in the sidebar greyed, labelled "no geometry" | Absence currently looks like an app bug to a viewer | 30 min |
| 3 | Real BMC ward boundaries instead of `0.028°` squares | The squares are visibly not wards at zoom < 12 — the first thing a BMC officer would notice | 2–3 h |
| 4 | Mobile layout | README says desktop-only; half the room will open it on a phone | 3–4 h |
| 5 | Zoom-dependent styling — thinner lines at low zoom | At zoom 12 the casings merge into blobs | 30 min |
| 6 | Cap the demo at the 6 wards it has, and say so on screen | "6 Mumbai wards" is a credible pilot; an unlabelled map implies city-wide coverage | 15 min |

`npm run build` currently emits an 825 KB JS chunk (246 KB gzipped). Acceptable for a demo, worth
code-splitting later — not before 15 August.

---

## 4. What not to do before 15 August

- **Do not port to MapLibre.** MapLibre is the better long-term choice — vendor-neutral, no key, same
  engine on web and app — but it is a rewrite of the render layer with seven days on the clock, and
  Leaflet is now doing the job correctly.
- **Do not add live GPS collection to the demo.** Field accuracy is its own problem: iOS Safari with
  Precise Location off returns 3–9 km accuracy silently, so raw fixes need an accuracy gate and
  map-matching before they can be trusted onto a segment. That is the real product; it is not a
  demo feature.
- **Do not swap the hardcoded data for a database.** The data being static is not the risk. The data
  being *fabricated about real named parties* is, and §2.1 fixes that without a backend.

---

## 5. Verification

Checks run against the branch, in-page at `http://localhost:5173`:

- `npm run build` — clean, `✓ built in 1.31s`
- Rendered polylines: 50 paths (25 roads × colour + casing), max 114 vertices on one road; the
  pre-fix maximum was 2
- Tiles: 30/30 loaded
- Attribution control text: `Leaflet | © OpenStreetMap contributors`
- Console: 0 errors
- Screenshots: `docs/br-andheri-z14.png`, `docs/br-bandra.png` — roads visibly follow Swami
  Vivekanand Road, Andheri–Kurla Road, LBS Marg, Linking Road and Hill Road

The screenshots are the evidence that matters here. Vertex counts prove geometry was loaded; only
looking at the raster proves it was loaded onto the right streets.

*Prepared by Surya AI. Findings reference file paths and line numbers in this repository at commit
`55acce9`; the Play policy and OSM tile policy statements should be re-verified against the vendors'
own current pages before being repeated publicly.*

---

## 6. How Actual Telemetry Data Is Outputted & Ingested

Based on `docs/BETTERROADS_ARCHITECTURE_AND_BEGINNER_GUIDE.md`, actual road health metrics follow a 4-stage data pipeline:

1. **Mobile Sensor Engine Processing**:
   - Accelerometer ($50\text{ Hz}$) samples vertical jolts ($Z$-axis) and applies a low-pass filter ($\alpha = 0.8$) to isolate dynamic forces from gravity.
   - Vehicle baseline vibration is subtracted (e.g. Sedan: $1.2\text{ m/s}^2$, Motorcycle: $4.0\text{ m/s}^2$).
   - A $500\text{ ms}$ sliding window computes Root Mean Square (RMS) acceleration.
   - Events are classified: `BUMP` ($>12\text{ m/s}^2$), `POTHOLE` ($>22\text{ m/s}^2$), `SWERVE` ($\text{Gyro}_z > 0.6\text{ rad/s}$).
   - Every $300\text{ meters}$, a Road Quality Index (RQI) score ($0 - 100$) is computed:
     $$\text{RQI} = 100 - \text{roughnessPenalty} - \text{eventPenalty}$$

2. **Backend API Ingestion (`POST /user/mobile/traveldata`)**:
   - The mobile app uploads a JSON payload containing journey summaries, $300\text{m}$ segment RQI scores, and precise pothole lat/lon coordinates.
   - The Hono API validates incoming data using Zod schemas and prevents duplicate uploads via `journey.id` idempotency checks.

3. **Spatial Quantization Grid (`segmentKeyFor`)**:
   - Coordinates are quantized into $0.001^\circ \approx 111\text{m} \times 111\text{m}$ grid cells:
     ```typescript
     export function segmentKeyFor(lat: number, lon: number): string {
       const qLat = (Math.floor(lat / 0.001) * 0.001).toFixed(3);
       const qLon = (Math.floor(lon / 0.001) * 0.001).toFixed(3);
       return `${qLat}:${qLon}`;
     }
     ```
   - Running averages and daily snapshots (`segment_snapshots`) are saved in PostgreSQL for historical time-slider playback.

4. **Public Data Output API (`GET /public/roads`)**:
   - Exposes aggregated `road_segments` and `segment_snapshots` queried by map bounding boxes (`minLat, maxLat, minLon, maxLon`) for real-time visualization.

---

## 7. How Roads Are Highlighted & Drawn on the Map

1. **Geometry Fetching (`scripts/fetch-osm-roads.mjs`)**:
   - Queries OpenStreetMap Overpass API for named highway ways around ward centroids.
   - Matches colloquial road names against official OSM parenthetical titles (e.g. `Turner Road` $\rightarrow$ `Gurunanak Marg (Turner Road)`).
   - Bakes polyline coordinates into `src/data/roadGeometry.json`. Unmatched roads are set to `null` and skipped to prevent misleading straight-line renders.

2. **Zoom-Dependent Layering (`MapView.jsx`)**:
   - **Zoom < 12**: Renders `<WardPolygons>` to display broad ward area health.
   - **Zoom >= 12**: Switches to high-density street-level polylines (`<RoadSegments>`).

3. **Double-Stroke Polyline Rendering (`RoadSegments.jsx`)**:
   - **Outer White Casing**: Renders a wider `<Polyline>` (`weight: baseWeight + 4`, `opacity: 0.85`) under the road line for contrast against raster basemap tiles.
   - **Inner Severity Stroke**: Renders an inner `<Polyline>` (`weight: baseWeight`) colored dynamically using RQI stops:
     - Good ($75 - 100$): Emerald Green (`#22c55e` / `#0ca30c`)
     - Minor ($60 - 74$): Amber Yellow (`#eab308` / `#fab219`)
     - Poor ($35 - 59$): Orange (`#f97316` / `#ec835a`)
     - Severe ($0 - 34$): Red (`#ef4444` / `#d03b3b`)

---

## 8. FAQs: Automatic vs. Manual Road Mapping Guide

### Q1: Can roads be mapped automatically, or must each one be mapped manually?

- **Manual Mapping**:
  - Requires manually drawing coordinates on GeoJSON editor tools (like `geojson.io` or QGIS) or hand-coding arrays of latitude/longitude points.
  - *Pros*: Precise control over exact line segment geometry.
  - *Cons*: Extremely slow, unmaintainable, labor-intensive, and impossible to scale across an entire city or nation.

- **Automatic Mapping (Recommended & Implemented)**:
  - Fetches real road way geometry automatically using APIs (such as OpenStreetMap Overpass API, Mapbox Map Matching API, or OpenRouteService).
  - *Pros*: Zero manual coordinate entry. Automatically pulls official street curves, intersections, and multi-segment polylines for any named highway.
  - *Cons*: Requires exact road name matching or GPS map-matching to resolve colloquial/local street names.

---

### Q2: What options do we have if we want FULL AUTOMATIC road mapping across all roads?

Here are the 3 architectural approaches to achieve 100% automatic road mapping:

1. **Option A: OpenStreetMap Overpass API Bounding-Box Extraction (Current Approach)**
   - Query Overpass for all `highway` ways inside a bounding box or ward boundary.
   - *Pros*: 100% free, open-source, no API keys or subscription fees.
   - *Cons*: Requires alias mapping when local street names differ from official OSM tags.

2. **Option B: GPS Trace Map-Matching Service (Valhalla / Mapbox Map Matching API)**
   - As vehicles drive, raw GPS coordinate streams are sent to a Map-Matching API which automatically snaps noisy GPS points to the exact OpenStreetMap road network edges (`OSM Way ID`).
   - *Pros*: Fully automated, handles raw driving paths without needing road names.
   - *Cons*: Requires running an open-source Valhalla server or paying Mapbox API usage fees.

3. **Option C: Automated Scraping & Geocoding (Nominatim / Overpass Scraper)**
   - Run a batch script that scrapes lat/long bounding geometries for all highways across a city/state and caches them in a spatial PostGIS database.
   - *Pros*: Instant lookup times; covers every road segment in the region.

---

### ❓ Question for the User: Which automatic mapping approach should we pursue next?

> [!TIP]
> **Please let me know your preference:**
> 1. **Expand OSM Overpass Matcher**: Should we add more road name aliases to `fetch-osm-roads.mjs` to resolve the 5 currently unmatched roads?
> 2. **Implement Live Bounding-Box (`bbox`) Extraction**: Should we fetch all OSM roads dynamically for whatever area the map is currently viewing?
> 3. **Explore GPS Map-Matching (Valhalla/OSRM)**: Should we set up automated GPS snapping for incoming mobile trip logs?

