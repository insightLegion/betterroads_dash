# BetterRoads — Design System & Map Page Specifications

This document outlines the complete design system, typography hierarchy, color tokens, layout grid, component specifications, map rendering rules, accessibility standards, and motion guidelines for **BetterRoads**, with a dedicated, exhaustive specification for the **Map Page (`/map`)**.

---

## 1. Core Design Philosophy

BetterRoads pairs **Editorial Minimalism** with **High-Density Civic Telemetry**. The design is grounded in three principles:

1. **Pure White Canvas & True-Black Ink**: High-legibility editorial layout using structured borders (`#e7e5e2`, `border-slate-200`) and rich slate ink typography (`#0a0a0a`, `#0f172a`).
2. **Single Saffron Accent + Functional Civic Color**: The signature saffron (`#e0611c`) is used exclusively for primary brand accents and signature moments. Status colors (Green, Amber, Orange, Red) are functional and reserved strictly for Road Quality Index (RQI) telemetry and civic alerts.
3. **Immersive Map Chrome**: The Map Page combines a clean, structured left sidebar (`360px`) with a floating glassmorphism control overlay (`bg-white/95 backdrop-blur-md`) over a cartographic basemap.

---

## 2. Design Tokens & Color Palette

### 2.1 Brand & Canvas Color Palette

| Token Name | CSS Variable | Hex / Value | Description & Usage |
| :--- | :--- | :--- | :--- |
| **Paper Canvas** | `--color-paper` | `#ffffff` | Primary background canvas |
| **Paper Secondary** | `--color-paper-2` | `#f5f5f4` / `bg-slate-50` | Card wells, search backgrounds, sidebar section header fill |
| **Paper Deeper** | `--color-paper-3` | `#ececea` / `bg-slate-100` | Section backgrounds, active button fills |
| **Ink Core** | `--color-ink` | `#0a0a0a` / `text-slate-900` | Headlines, primary text, prominent metrics |
| **Ink Secondary** | `--color-ink-2` | `#52504c` / `text-slate-600` | Subtitles, body text, secondary metrics |
| **Ink Muted** | `--color-ink-3` | `#8f8b85` / `text-slate-400` | Micro-captions, timestamps, disabled labels |
| **Hairline Border** | `--color-line` | `#e7e5e2` / `border-slate-200` | Standard divider lines, card borders |
| **Strong Border** | `--color-line-strong` | `#d6d3ce` / `border-slate-300` | Scrollbar thumb, active element outlines |
| **Saffron Accent** | `--color-saffron` | `#e0611c` | Primary brand accent, high contrast on white |
| **Saffron Soft Wash** | `--color-saffron-soft` | `#faeadd` | Hover states, highlight washes |

#### India Tricolor Signature Palette *(Reserved for Signature Moments Only)*
- **Flag Saffron**: `#ff9933`
- **Flag Green**: `#138808`
- **Deep Civic Green**: `#1b7a43` / `#059669` (Emerald 600)

---

### 2.2 Road Quality Index (RQI) Telemetry Palette (0–100 Scale)

Road Quality Index (RQI) ranges from **0 (Worst)** to **100 (Optimal)**. Color coding follows the universal traffic severity scale, engineered for **CVD (Color Vision Deficiency) Accessibility** with a validated Delta E separation > 12.4 across deutan/protan/tritan vision types.

| RQI Range | Condition Label | Primary Hex | Tailwind Classes | Usage Context |
| :---: | :---: | :---: | :---: | :--- |
| **75 – 100** | **Good** | `#0ca30c` / `#22c55e` | `bg-emerald-500`, `text-emerald-700`, `bg-emerald-600` | Smooth road surface, recent paving, normal traffic |
| **60 – 74** | **Fair / Minor** | `#fab219` / `#eab308` | `bg-amber-500`, `text-amber-700`, `border-amber-200` | Slight roughness, minor cracks, under observation |
| **35 – 59** | **Poor** | `#ec835a` / `#f97316` | `bg-orange-500`, `text-orange-700`, `border-orange-200` | Significant pothole clusters, urgent work order needed |
| **0 – 34** | **Severe / Critical** | `#d03b3b` / `#ef4444` | `bg-red-500`, `text-red-600`, `bg-red-50`, `border-red-100` | Hazardous potholes, SLA overdue, dangerous road condition |

---

### 2.3 Map Overlay & UI Chrome Colors

| UI Element | Color / Effect | Specification |
| :--- | :--- | :--- |
| **Floating Panels** | Translucent White Glass | `bg-white/95`, `backdrop-blur-md`, `border border-slate-200`, `shadow-lg` |
| **Cluster Markers** | Dark Obsidian | `rgba(15, 17, 26, 0.95)` (`#0f111a`), text `#e2e8f0`, `border: 1.5px solid rgba(255, 255, 255, 0.25)`, `shadow: 0 8px 20px rgba(0,0,0,0.5)` |
| **Boundary Polygon** | Red Dashed Overlay | Stroke `#ef4444`, weight `1.5px`, dash array `'3, 3'`, fill `#fca5a5` @ `12%` opacity |
| **Major Road Polyline** | Dynamic RQI Stroke | Weight `8px`, opacity `0.88`, lineCap `'round'`, lineJoin `'round'` |
| **Circle Dot Markers** | Translucent Dot + Glow | Background `35%` opacity fill + solid `1.5px` border + `0 0 10px {color}88` drop-glow shadow |

---

## 3. Typography System & Allowed Fonts

### 3.1 Allowed Font Families

```css
/* Display & Headlines */
--font-display: "Bricolage Grotesque", ui-sans-serif, system-ui, sans-serif;

/* Body & Interface UI */
--font-body: "Inter", ui-sans-serif, system-ui, sans-serif;

/* Regional / Hindi Typography */
--font-hindi: "Noto Sans Devanagari", "Inter", ui-sans-serif, sans-serif;

/* Metric & Code Font */
--font-mono: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", monospace;

/* macOS Native System Stack (Monumental Headers) */
--font-system: -apple-system, BlinkMacSystemFont, "SF Pro Display", "Helvetica Neue", "Segoe UI", Arial, sans-serif;
```

---

### 3.2 Typography Hierarchy & Specs

| Hierarchy | Font Family | Size | Weight | Tracking | Case / Style | Usage |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Hero Title** | Display / System | `2.25rem - 3.5rem` (`36-56px`) | `800` (Extrabold) | `-0.03em` | Sentence | Main hero landing, page title |
| **Sidebar Title** | Inter | `1.0rem` (`16px`) | `800` (Extrabold) | `-0.02em` | Title Case | Sidebar brand title ("Better Roads") |
| **Section Header** | Inter | `1.125rem` (`18px`) | `800` (Extrabold) | `-0.01em` | Title Case | Selected Ward title ("G/North Ward - Dadar") |
| **Card Subtitle** | Inter | `0.875rem` (`14px`) | `700` (Bold) | Normal | Sentence | Ward list item names, modal titles |
| **Eyebrow Label** | Inter | `0.625rem - 0.72rem` (`10-11.5px`) | `700` (Bold) | `+0.22em` | UPPERCASE | Section dividers ("CURRENT CONDITION", "12-MONTH HISTORY") |
| **Body Standard** | Inter | `0.75rem - 0.875rem` (`12-14px`) | `400` / `500` | Normal | Sentence | Descriptions, list text, telemetry specs |
| **Micro Caption** | Inter | `0.6875rem` (`11px`) | `500` | Normal | Sentence | Timestamps, ward codes, sensor trip counts |
| **RQI Score Metric** | Inter / Mono | `2.25rem - 2.5rem` (`36-40px`) | `800` (Extrabold) | `-0.03em` | Numeric | Big RQI display value (`24 / 100`) |
| **Cluster Counter** | System / Inter | `0.75rem - 0.875rem` (`12-14px`) | `700` (Bold) | Normal | Numeric | Dark map cluster dot counts (`7.3k`, `4.2k`) |

---

## 4. Spacing Scale & Layout Architecture

### 4.1 Spacing Tokens (8px / 4px Base Grid)

```
0.125rem (2px)   ── Micro inline gap (dot offset, line offset)
0.25rem  (4px)   ── Compact element padding, icon-text gap
0.375rem (6px)   ── Button internal vertical padding
0.5rem   (8px)   ── Standard element gap, small card padding
0.625rem (10px)  ── Compact container padding
0.75rem  (12px)  ── Search bar padding, badge padding
1.0rem   (16px)  ── Sidebar section padding, modal padding (16px)
1.25rem  (20px)  ── Container gap, header padding
1.5rem   (24px)  ── Map overlay edge offset (24px)
2.0rem   (32px)  ── Large section spacing
22.5rem  (360px) ── Fixed Left Sidebar Width (w-[360px])
```

---

### 4.2 Map Page Layout Grid Structure

```
+---------------------------------------------------------------------------------------------------------+
|                                        VIEWPORT CONTAINER (100vw x 100vh)                                |
| flex h-screen w-screen bg-slate-100 font-sans overflow-hidden                                           |
+------------------------------------+--------------------------------------------------------------------+
| 1. LEFT SIDEBAR PANEL              | 2. RIGHT MAIN MAP CANVAS                                           |
| w-[360px] shrink-0 z-20 flex-col   | relative flex-1 h-full w-full bg-slate-200 overflow-hidden          |
| border-r border-slate-200 bg-white |                                                                    |
| shadow-lg overflow-y-auto          |  +--------------------------------------------------------------+  |
|                                    |  | TOP HEADER BAR (absolute top-4 right-4 z-20)                   |  |
|  [Header & Search Input]           |  | [ Map | File complaint ]                       [User MK Badge] |  |
|  --------------------------------- |  +--------------------------------------------------------------+  |
|                                    |                                                                    |
|  [MODE A: ALL MONITORED AREAS]     |  [ Leaflet Basemap Tile Layer + Greater Mumbai Dash Polygon ]     |
|   - Search Filter Input            |  [ Highlighting Major Expressways (Polyline RQI stroke 8px) ]      |
|   - Interactive Ward Cards List    |  [ Local Neighborhood Street Circle Dots (No Pin Pointer icons) ]  |
|                                    |  [ Cluster Counter Nodes (rgba(15,17,26,0.95) sleek dark circles) ] |
|  [MODE B: WARD DETAIL VIEW]        |                                                                    |
|   - Back Navigation & Ward Code    |  +--------------------------------+                                |
|   - Big RQI Score (36px) & SLA Alert|  | 3. BOTTOM LEFT OVERLAY (z-10)  |                                |
|   - 12-Month History Bar Chart     |  | [ Condition | Complaints | Demo]|                                |
|   - Vertical Timeline Events List  |  | [ Road Condition Color Legend ]|                                |
|                                    |  +--------------------------------+                                |
|                                    |                                                                    |
|                                    |            +-------------------------------------------+           |
|                                    |            | 4. FLOATING TIMELINE SLIDER (bottom-6 z-20)|           |
|                                    |            | [ Clock Icon ] Historical view: Nov 25    |           |
|                                    |            | [ Interactive Range Slider Track ]        |           |
|                                    |            +-------------------------------------------+           |
+------------------------------------+--------------------------------------------------------------------+
```

---

## 5. Map Page UI Components Specification

### 5.1 Left Sidebar Panel (`w-[360px]`)

#### Brand Header & Search Bar
- **Logo Badge**: `h-8 w-8`, `rounded-lg`, `bg-emerald-600`, text `#ffffff` (`font-bold text-sm`).
- **Title Text**: `font-extrabold text-base text-slate-900 leading-none`.
- **Search Input**: `w-full rounded-xl border border-slate-200 bg-slate-50 py-2 pl-9 pr-3 text-xs text-slate-700 placeholder-slate-400 focus:border-emerald-500 focus:bg-white focus:ring-1 focus:ring-emerald-500 transition-all`.

#### Sidebar Mode A: Ward List Items
- **Container**: `flex items-center justify-between p-4 hover:bg-slate-50 transition-colors cursor-pointer`.
- **Status Circle**: `h-2.5 w-2.5 rounded-full shrink-0` color-coded by RQI status (`bg-red-500`, `bg-orange-500`, `bg-amber-500`, `bg-emerald-500`).
- **Ward Name**: `font-bold text-sm text-slate-900 group-hover:text-emerald-600 transition-colors`.
- **Problem Count**: `text-sm font-extrabold text-slate-700 font-mono`.

#### Sidebar Mode B: Ward Detailed Telemetry
- **RQI Big Score**: `text-4xl font-extrabold text-slate-900 tracking-tight` (e.g. `24` / `100`).
- **RQI Status Badge**: `rounded-md px-2 py-0.5 text-[10px] font-bold text-white uppercase` (`bg-red-500` for Severe, etc.).
- **SLA Warning Banner**: `rounded-xl bg-red-50 p-2.5 border border-red-100 text-center text-xs font-semibold text-red-700` (exceeded BMC 14-day SLA).
- **12-Month Bar Chart**:
  - Container height: `h-28` (`112px`).
  - Bar calculation: `heightPercent = Math.max(15, (item.score / 100) * 100)`.
  - Selected Bar: `ring-2 ring-slate-900 ring-offset-1 opacity-100`.
  - Non-selected Bar: `opacity-80 hover:opacity-100 transition-all duration-200`.
- **Events Timeline**:
  - Vertical Guide Rule: `before:absolute before:left-1.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200`.
  - Event Dot: `h-2.5 w-2.5 rounded-full border-2 border-white ring-1` (`bg-emerald-500`, `bg-amber-500`, `bg-red-500`, `bg-blue-500`).

---

### 5.2 Interactive Leaflet Map Canvas

#### Basemap Tiles
- **Default Tile Provider**: CartoDB Voyager Raster Tiles (`https://a.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.png`).
- **Satellite Tile Provider**: Esri World Imagery (`https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}`).

#### Map Layer Geometry Specs

1. **Greater Mumbai Boundary Polygon**:
   - Color: `#ef4444` (Red border)
   - Stroke Weight: `1.5px`
   - Stroke Style: Dashed (`dashArray: '3, 3'`)
   - Fill Color: `#fca5a5`
   - Fill Opacity: `0.12`

2. **Major Highway Corridors (Polylines)**:
   - Stroke Weight: `8px`
   - Opacity: `0.88`
   - Caps & Joins: `lineCap: 'round'`, `lineJoin: 'round'`
   - Color Dynamics: Dynamically assigned from RQI score for the selected historical month via `getRqiDetails(monthRqi).color`.

3. **Local Pothole / Rough Patch Marker Dots**:
   - **Design Rule**: No pointer pins or map markers. Pure sleek circular dot icons matching high-density telemetry specs.
   - **Small Circle**: `14px` diameter, `1.5px` stroke.
   - **Medium Circle**: `20px` diameter, `1.5px` stroke.
   - **Large Circle**: `28px` diameter, `1.5px` stroke.
   - **Drop Glow**: `box-shadow: 0 0 10px {stroke}88`.

4. **Cluster Counter Nodes**:
   - **Backdrop**: `rgba(15, 17, 26, 0.95)` (Dark Slate)
   - **Text Color**: `#e2e8f0` (`font-weight: 700`, `font-size: 12-14px`)
   - **Border**: `1.5px solid rgba(255, 255, 255, 0.25)`
   - **Shadow**: `box-shadow: 0 8px 20px rgba(0, 0, 0, 0.5)`
   - **Sizing Scale**:
     - `< 100` items: `38px` diameter
     - `< 1000` items: `46px` diameter
     - `>= 1000` items: `56px` diameter (Formatted with `k` suffix e.g., `7.3k`, `5.1k`)

---

### 5.3 Floating Overlay Controls

#### Top Right Header Bar (`top-4 right-4 z-20`)
- **Pill Container**: `rounded-xl border border-slate-200 bg-white/95 p-1 shadow-md backdrop-blur-md`.
- **Active Button**: `rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-800 shadow-2xs`.
- **Action Button ("File complaint")**: `rounded-lg px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors`.
- **User Avatar**: `h-9 w-9 rounded-full bg-emerald-700 font-bold text-white text-xs shadow-md border-2 border-white`.

#### Bottom Left Tabs & Legend (`bottom-6 left-6 z-10`)
- **Tabs Selector**: `rounded-full border border-slate-200 bg-white/95 p-1 shadow-lg backdrop-blur-md`.
  - Active Pill: `bg-emerald-600 text-white shadow-xs`.
  - Inactive Text: `text-slate-600 hover:text-slate-900`.
- **Legend Card**: `rounded-xl border border-slate-200 bg-white/95 p-3 shadow-lg backdrop-blur-md max-w-xs`.
  - Categories: Good (`bg-emerald-500`), Minor (`bg-amber-500`), Poor (`bg-orange-500`), Severe (`bg-red-500`).

#### Bottom Timeline Slider Bar (`bottom-6 left-1/2 -translate-x-1/2 z-20`)
- **Container**: `w-[min(38rem,calc(100vw-28rem))] rounded-2xl border border-slate-200/90 bg-white/95 p-3.5 shadow-2xl backdrop-blur-md`.
- **Active Month Tag**: `rounded-md bg-slate-900 px-2 py-0.5 font-mono text-[11px] font-bold text-white`.
- **Slider Control**: `h-2 w-full cursor-pointer appearance-none rounded-lg bg-emerald-100 accent-emerald-600 focus:outline-hidden`.

---

## 6. Theme Modes & Color Systems

BetterRoads utilizes a dual-theme strategy combining an editorial light chrome with a dark high-contrast telemetry layer:

### 6.1 Light Editorial Mode (Primary Application Chrome)
- **Canvas**: Pure `#ffffff` with `#f5f5f4` card fills.
- **Borders**: Subdued slate `#e7e5e2` (`border-slate-200`).
- **Typography**: True black `#0a0a0a` headlines, slate `#52504c` body text.

### 6.2 Dark Telemetry Overlay Mode (Map Cluster & Spatial Layer)
- **Clusters & Controls**: Dark Slate `#0f111a` (`rgba(15, 17, 26, 0.95)`).
- **Text & Numeric Badges**: White / Off-white `#f8fafc` / `#e2e8f0`.
- **Map Leaflet Popups**: `border-radius: 0.75rem`, `border: 1px solid #e7e5e2`, `box-shadow: 0 12px 32px -12px rgba(10, 10, 10, 0.25)`.

---

## 7. Motion, Transitions & Micro-Interactions

### 7.1 Easing Curves & Speeds
- **Standard Ease**: `cubic-bezier(0.22, 1, 0.36, 1)` (`--ease-out-quint`).
- **Map Camera FlyTo**: `duration: 1.5s`, smooth zoom trajectory.
- **Button Hover**: `transition-colors duration-150 ease-out`.
- **Sidebar Selection**: Smooth expand / tab slide `duration-200`.

### 7.2 Micro-Interactions & Animation Cues
- **Pulsing Badge**: `animate-pulse` on active viewing month pill (`bg-emerald-500`).
- **Bar Chart Hover**: Bar opacity transitions from `80%` to `100%` on hover, with a `ring-2 ring-slate-900` outline on the selected month bar.
- **Cluster Hover**: Scale transform `1.05` transition on hover over map cluster nodes.

### 7.3 Accessibility & Reduced Motion
```css
@media (prefers-reduced-motion: reduce) {
  html {
    scroll-behavior: auto;
  }
  *, *::before, *::after {
    animation-duration: 0.001ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.001ms !important;
  }
}
```

---

## 8. Accessibility & Responsiveness Guidelines

1. **Colorblind Safety (CVD)**: RQI status badges never rely on color alone. Every indicator pairs color with an explicit numeric score (e.g. `24/100`) and textual label (`Good`, `Fair`, `Poor`, `Severe`).
2. **Contrast Ratio Compliance**: Text and icon elements maintain a minimum contrast ratio of **4.5:1** against white and slate backgrounds.
3. **Interactive Target Sizes**: All interactive buttons, timeline nodes, and cluster circles maintain a minimum hit area of **36px x 36px** (desktop) and **44px x 44px** (touch).
4. **Responsive Rem Scaling**:
   - Screen width `≥ 1800px`: Root font size scales to `17.5px`.
   - Screen width `≥ 2300px`: Root font size scales to `19px`.
   - Viewport height scaling ensures the timeline bar and sidebar fit without overlap.

---

## 9. File Reference Index

- Design Tokens & Root CSS: [index.css](file:///e:/darshi/betterroads/betterroads/website/src/index.css)
- Map Page Main Component: [MapPage.tsx](file:///e:/darshi/betterroads/betterroads/website/src/components/map/MapPage.tsx)
- Leaflet Map Component: [interactive-map.tsx](file:///e:/darshi/betterroads/betterroads/website/src/components/ui/interactive-map.tsx)
- Mumbai Data & Ward Telemetry: [mumbaiData.ts](file:///e:/darshi/betterroads/betterroads/website/src/components/map/mumbaiData.ts)
- RQI Scale & Color Stops: [rqiScale.ts](file:///e:/darshi/betterroads/betterroads/website/src/components/map/rqiScale.ts)
