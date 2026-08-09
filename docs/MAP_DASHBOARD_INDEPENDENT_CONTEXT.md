# BetterRoads Public Map Dashboard: Independent Development Context

This document is a self-contained developer guide and system overview for building or refactoring the **Public Road Quality Map Dashboard** (`website/src/components/map`). It bridges the database schema, mobile data ingestion pipeline, backend API contracts, and front-end code configuration.

---

## 1. Architectural & File Inventory

The public map module is located entirely under `website/src/components/map/`. It runs on React and uses **MapLibre GL JS** to render vector data and OpenStreetMap tile overlays.

### Component Directory Layout
- **[MapPage.tsx](file:///e:/darshi/betterroads/betterroads/website/src/components/map/MapPage.tsx)**: Main page controller. Bootstrap and configures the MapLibre instance, tracks map bounding box (viewport bounds), handles slider timeline state changes, registers event layer/road layer click/hover listeners, and renders overlays.
- **[MapLegend.tsx](file:///e:/darshi/betterroads/betterroads/website/src/components/map/MapLegend.tsx)**: Displays the color legend (`0 Poor` to `100 Good`) matching HSL/HEX road quality thresholds and the single event indicator.
- **[TimelineBar.tsx](file:///e:/darshi/betterroads/betterroads/website/src/components/map/TimelineBar.tsx)**: Interactive timeline controller docked at the bottom. Feeds manual scrubbing or automatic playback of historical segments. Shows a vertical bar sparkline indicating segments updated per calendar day.
- **[api.ts](file:///e:/darshi/betterroads/betterroads/website/src/components/map/api.ts)**: Thin client wrapping unauthenticated browser requests targeting the public backend endpoints.
- **[rqiScale.ts](file:///e:/darshi/betterroads/betterroads/website/src/components/map/rqiScale.ts)**: Declares thresholds, labels, gradients, and styling expressions.

---

## 2. Ingestion Pipeline & Database Schema

The map displays aggregated representations of real-world road quality. Data flows from mobile accelerometer/gyroscope/GPS sensors into the server's relational database.

### End-to-End Data Flow Diagram
```
[1. Mobile sensors: 50 Hz] ──> [2. Sensor Engine computes RQI] ──> [3. POST /user/mobile/traveldata]
                                                                                │
[6. Frontend Map Canvas]  <── [5. BBox query /roads & /events]  <── [4. DB Aggregation & Snapshots]
```

### Relational Database Schema (Drizzle ORM)
The backend routes read from five core tables in PostgreSQL:

#### 1. `devices`
Tracks unique app installations. Keys off UUID generated on first launch.
```typescript
export const devices = pgTable('devices', {
  id: serial('id').primaryKey(),
  deviceUuid: text('device_uuid').notNull(),
  platform: text('platform').notNull().default('android'),
  model: text('model'),
  appVersion: text('app_version'),
  firstSeenAt: timestamp('first_seen_at', { withTimezone: true }).notNull().defaultNow(),
  lastSeenAt: timestamp('last_seen_at', { withTimezone: true }).notNull().defaultNow(),
  journeyCount: integer('journey_count').notNull().default(0),
});
```

#### 2. `journeys`
One completed trip from point A to point B.
```typescript
export const journeys = pgTable('journeys', {
  id: text('id').primaryKey(), // Client-minted UUID for idempotency
  deviceId: integer('device_id').notNull().references(() => devices.id),
  startedAt: timestamp('started_at', { withTimezone: true }).notNull(),
  endedAt: timestamp('ended_at', { withTimezone: true }).notNull(),
  distanceM: doublePrecision('distance_m').notNull(),
  durationS: integer('duration_s').notNull(),
  avgSpeedKmh: doublePrecision('avg_speed_kmh').notNull(),
  vehicleType: text('vehicle_type').notNull(), // CAR, BIKE, AUTO_RICKSHAW, BUS, TRUCK, etc.
  baseFloorRms: doublePrecision('base_floor_rms'),
  rqiScore: doublePrecision('rqi_score').notNull(), // 0-100 overall score
  startLat: doublePrecision('start_lat').notNull(),
  startLon: doublePrecision('start_lon').notNull(),
  endLat: doublePrecision('end_lat').notNull(),
  endLon: doublePrecision('end_lon').notNull(),
  receivedAt: timestamp('received_at', { withTimezone: true }).notNull().defaultNow(),
});
```

#### 3. `road_events`
Individual physical jolts (pothole, bump, speed breaker) recorded with telemetry data.
```typescript
export const roadEvents = pgTable('road_events', {
  id: text('id').primaryKey(), // Client-minted UUID
  journeyId: text('journey_id').notNull().references(() => journeys.id),
  type: text('type').notNull(), // 'POTHOLE' | 'BUMP' | 'SPEED_BREAKER' | 'SWERVE' | 'MANUAL_REPORT'
  severity: doublePrecision('severity').notNull(), // 0.0 - 1.0
  occurredAt: timestamp('occurred_at', { withTimezone: true }).notNull(),
  lat: doublePrecision('lat').notNull(),
  lon: doublePrecision('lon').notNull(),
  speedKmh: doublePrecision('speed_kmh'),
  segmentKey: text('segment_key').notNull(), // Linked to quantized cell
});
```

#### 4. `road_segments`
Aggregated stretch of road (~100m quantized cell grid). `currentRqi` is updated on every upload.
```typescript
export const roadSegments = pgTable('road_segments', {
  segmentKey: text('segment_key').primaryKey(), // e.g. "19.055:72.840"
  centerLat: doublePrecision('center_lat').notNull(),
  centerLon: doublePrecision('center_lon').notNull(),
  geometry: jsonb('geometry').notNull(), // GeoJSON coordinates polyline: [[lat, lon], ...]
  currentRqi: doublePrecision('current_rqi').notNull(), // Running average RQI (0–100)
  sampleCount: integer('sample_count').notNull().default(0), // Total trips recorded in cell
  eventCount: integer('event_count').notNull().default(0),
  lastUpdatedAt: timestamp('last_updated_at', { withTimezone: true }).notNull().defaultNow(),
});
```

#### 5. `segment_snapshots`
Daily cumulative snapshots of segment scores. **Powers the frontend map timeline slider.**
```typescript
export const segmentSnapshots = pgTable('segment_snapshots', {
  id: serial('id').primaryKey(),
  segmentKey: text('segment_key').notNull().references(() => roadSegments.segmentKey),
  day: date('day').notNull(), // YYYY-MM-DD
  rqi: doublePrecision('rqi').notNull(), // Cumulative RQI as of this day
  sampleCount: integer('sample_count').notNull(),
  eventCount: integer('event_count').notNull().default(0),
});
```

### Quantization & Aggregation Math (Server Ingestion)
1. **Grid Keying**: Segments are mapped to a $0.001^\circ \approx 111\text{m}$ grid cell:
   $$\text{segmentKey} = \lfloor\text{lat} / 0.001\rfloor \times 0.001 + \text{":"} + \lfloor\text{lon} / 0.001\rfloor \times 0.001$$
2. **Running Average RQI**: Updated using recency weighting with a factor of $\alpha = 0.15$:
   $$\text{RQI}_{new} = \text{RQI}_{prev} \times (1 - \alpha) + \text{RQI}_{sample} \times \alpha$$

---

## 3. Public API Contracts

The map client makes three requests to load roads, event points, and timeline steps.

### 1. `GET /api/public/timeline`
Fetches the calendar bounds and activity updates. Used to populate the bottom slider sparkline.
- **Response Shape**:
  ```json
  {
    "ok": true,
    "earliest": "2026-08-01",
    "latest": "2026-08-07",
    "days": [
      {
        "day": "2026-08-01",
        "segmentsUpdated": 12,
        "avgRqi": 65,
        "eventCount": 4
      }
    ]
  }
  ```

### 2. `GET /api/public/roads?minLat=...&maxLat=...&minLon=...&maxLon=...[&at=YYYY-MM-DD]`
Fetches aggregated road segments within the map's current bounding box.
- **Parameters**:
  - `minLat`, `maxLat`, `minLon`, `maxLon`: Decimals representing current screen bounds.
  - `at` (Optional): Target calendar day (`YYYY-MM-DD`). If omitted, returns the current real-time state of the database (`road_segments`). If specified, queries `segment_snapshots` for records on or prior to `at`.
- **Response Shape**:
  ```json
  {
    "ok": true,
    "at": "2026-08-07",
    "segments": [
      {
        "segmentKey": "19.055:72.840",
        "centerLat": 19.0555,
        "centerLon": 72.8405,
        "geometry": [[19.0551, 72.8401], [19.0559, 72.8409]],
        "rqi": 78.4,
        "sampleCount": 4,
        "eventCount": 1
      }
    ]
  }
  ```

### 3. `GET /api/public/events?minLat=...&maxLat=...&minLon=...&maxLon=...[&from=YYYY-MM-DD][&to=YYYY-MM-DD][&type=POTHOLE]`
Loads discrete point events (e.g. pothole coordinates) for mapping overlays.
- **Response Shape**:
  ```json
  {
    "ok": true,
    "events": [
      {
        "id": "e1a2-uuid",
        "type": "POTHOLE",
        "severity": 0.82,
        "occurredAt": "2026-08-07T10:15:30Z",
        "lat": 19.0581,
        "lon": 72.8299,
        "speedKmh": 32.5,
        "segmentKey": "19.058:72.829"
      }
    ]
  }
  ```

---

## 4. Frontend Styling & Behavior Specification

### Visual HSL/HEX Color Rules
Road segments color-code themselves according to strict `RQI` ranges. Use these definitions in styling polylines:

| RQI Range | Road Status | Hex Color Code | Map Polyline Styling |
| :--- | :--- | :--- | :--- |
| **$75 \le \text{RQI} \le 100$** | **Great Road** (Smooth) | `#22c55e` | `weight: 5, opacity: 0.8` |
| **$45 \le \text{RQI} < 75$** | **Fair Road** (Moderate wear) | `#eab308` | `weight: 5, opacity: 0.85` |
| **$0 \le \text{RQI} < 45$** | **Severe Bad Road** (Potholes) | `#ef4444` | `weight: 6, opacity: 0.9` |
| **No Data** | **Unmapped Road** | `#9ca3af` | `weight: 4, opacity: 0.4, dashArray: [5, 5]` |

### Development Constraints & Performance Checklist
1. **Viewport Bounding Box**: Never request global datasets. Listen to the map `moveend` event to retrieve current screen coordinates (`map.getBounds()`) and use them as parameters in your requests.
2. **Event Debounce**: Wrap pan/zoom map listeners in a `250ms` or `300ms` debounce timer so scrubbing or dragging does not spam the API with excessive network calls.
3. **Empty States**: Render empty screens gracefully if `fetchTimeline` indicates zero database journeys have occurred yet. Display user-friendly info detailing how driving with the mobile app populates the map.
4. **Popups**: Clicking a line segment must trigger an interactive popup detailing:
   - Current segment RQI score and textual label (Great, Fair, Poor).
   - Sample counts (number of trips recorded).
   - Total events registered.
5. **Basemap Theme**: Use CartoDB Positron (`https://tile.openstreetmap.org/{z}/{x}/{y}.png`) or equivalent light monochrome maps so the overlay colors remain prominent and legible.
6. **Mobile Layout**: Keep viewports touch-friendly, map navigation keys clean, and the timeline scrubber responsive.
