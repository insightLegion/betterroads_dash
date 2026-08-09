# User-Facing Road Health Map: Open Maps & Low-Cost Blueprint

This document is a comprehensive technical blueprint and learning guide for building a **public, user-facing road health dashboard**. 

If you are a web developer looking to build an interactive map where citizens can search any location, view color-coded road health (Green/Yellow/Red), inspect pothole hazards, and scrub through historical time sliders **without paying high fees for Google Maps or Mapbox**, this guide is for you!

---

## Table of Contents

1. [Architectural Blueprint & Goal](#1-architectural-blueprint--goal)
2. [Open-Source Mapping Options (100% Free & Low Cost)](#2-open-source-mapping-options-100-free--low-cost)
   - [Why Avoid Google Maps API for Big Data?](#why-avoid-google-maps-api-for-big-data)
   - [Leaflet.js vs. MapLibre GL JS](#leafletjs-vs-maplibre-gl-js)
   - [Free Map Tile Providers](#free-map-tile-providers)
3. [Geocoding 101: What It Is & How To Use It](#3-geocoding-101-what-it-is--how-to-use-it)
   - [Forward Geocoding vs. Reverse Geocoding](#forward-geocoding-vs-reverse-geocoding)
   - [Free & Open-Source Geocoding APIs](#free--open-source-geocoding-apis)
   - [Adding Location Search to Your Map](#adding-location-search-to-your-map)
4. [High-Performance Map Rendering: Bounding Box Queries](#4-high-performance-map-rendering-bounding-box-queries)
   - [The Problem: Rendering 1,000,000 Potholes](#the-problem-rendering-1000000-potholes)
   - [The Solution: `bbox` Spatial Queries](#the-solution-bbox-spatial-queries)
   - [Integrating BetterRoads Backend Endpoints](#integrating-betterroads-backend-endpoints)
5. [Step-by-Step 4-Week Learning & Implementation Roadmap](#5-step-by-step-4-week-learning--implementation-roadmap)
   - [Week 1: Leaflet Fundamentals & Basic Map Setup](#week-1-leaflet-fundamentals--basic-map-setup)
   - [Week 2: Connecting Backend API & Spatial Rendering](#week-2-connecting-backend-api--spatial-rendering)
   - [Week 3: Location Search Bar & Geocoding](#week-3-location-search-bar--geocoding)
   - [Week 4: Time-Slider & Historical Playback](#week-4-time-slider--historical-playback)

---

## 1. Architectural Blueprint & Goal

The user-facing dashboard is a web application where citizens, drivers, and city councils can visually explore road conditions in real time.

```
┌────────────────────────────────────────────────────────────────────────┐
│                        User's Web Browser                              │
│                                                                        │
│   ┌────────────────────────────────────────────────────────┐           │
│   │ [🔍 Search City / Address... (Nominatim Geocoder API)] │           │
│   └────────────────────────────────────────────────────────┘           │
│   ┌────────────────────────────────────────────────────────┐           │
│   │                                                        │           │
│   │                   LEAFLET.JS MAP                       │           │
│   │  - OpenStreetMap Base Tile Layer                       │           │
│   │  - Color Polylines: Green (RQI 75+), Red (RQI < 45)    │           │
│   │  - Pothole Event Markers with Popup Stats              │           │
│   │                                                        │           │
│   └────────────────────────────────────────────────────────┘           │
│   ┌────────────────────────────────────────────────────────┐           │
│   │  📅 Time Slider: [2026-08-01 ═══════════════◯ 2026-08-06]    │           │
│   └────────────────────────────────────────────────────────┘           │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ HTTP GET /public/roads?minLat=...
                                    v
                       ┌─────────────────────────┐
                       │ BetterRoads Backend API │
                       └─────────────────────────┘
```

---

### Empirical Validation: Test Run Results

We ran automated sample data through the exact BetterRoads SensorEngine and Quantization Grid math (`demo_sensor_to_map.js`). Here is the empirical proof of how raw sensor readings map directly to UI polyline colors:

#### Test Scenario A: Smooth Highway Drive
- **Raw Sensor Data**: Slight vibration around gravity ($9.81 \pm 0.2\text{ m/s}^2$).
- **Calculated Avg RMS**: $0.00\text{ m/s}^2$ (below vehicle baseline floor).
- **Events Detected**: `0`
- **Computed RQI**: `100.0 / 100`
- **Map Polyline Color**: **Green (`#22c55e`)**

#### Test Scenario B: Severe Pothole Stretch
- **Raw Sensor Data**: Impact force spike ($Z = 44.81\text{ m/s}^2$) + Swerve yaw spike ($\text{Gyro}_z = 0.8\text{ rad/s}$).
- **Calculated Avg RMS**: $2.94\text{ m/s}^2$
- **Events Detected**: `2` (`POTHOLE` force $26.56\text{ m/s}^2$ + `SWERVE`).
- **Computed RQI**: `46.6 / 100`
- **Map Polyline Color**: **Orange / Yellow (`#eab308`)** *(Drops to **Red `#ef4444`** when multiple potholes accumulate)*.

---

## 2. Open-Source Mapping Options (100% Free & Low Cost)

### Why Avoid Google Maps API for Big Data?

Google Maps charges **$7.00 per 1,000 map loads** and **$5.00 per 1,000 autocomplete queries**. If thousands of users zoom around looking at thousands of road segments, your bill can reach hundreds or thousands of dollars per month very quickly.

### Leaflet.js vs. MapLibre GL JS

| Feature | Leaflet.js (Recommended for Beginners) | MapLibre GL JS |
| :--- | :--- | :--- |
| **Rendering Tech** | HTML5 Canvas / SVG (2D Raster Tiles) | WebGL (3D Vector Tiles) |
| **Bundle Size** | Ultra Lightweight (~40 KB) | Larger (~250 KB) |
| **Learning Curve** | Extremely Easy (Can build a map in 10 lines) | Moderate (Requires learning vector styles) |
| **Smoothness** | Great for under 5,000 elements | Incredible performance for 100,000+ elements |

### Free Map Tile Providers

Map tiles are the background imagery squares of roads, terrain, and labels.
1. **OpenStreetMap Standard**: `https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png` (100% Free for fair use).
2. **CartoDB Positron / Dark Matter**: Sleek, modern monochrome tiles ideal for overlaying bright green/yellow/red road heatmaps:
   `https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png`

---

## 3. Geocoding 101: What It Is & How To Use It

### Forward Geocoding vs. Reverse Geocoding

- **Forward Geocoding**: Converting a human address string into latitude & longitude coordinates.
  - *Input*: `"Marine Drive, Mumbai"`
  - *Output*: `{ lat: 18.9438, lon: 72.8231 }`
- **Reverse Geocoding**: Converting latitude & longitude into a readable street name.
  - *Input*: `{ lat: 18.9438, lon: 72.8231 }`
  - *Output*: `"Netaji Subhash Chandra Bose Road, Mumbai"`

### Free & Open-Source Geocoding APIs

1. **Nominatim (OpenStreetMap Official)**:
   - *URL*: `https://nominatim.openstreetmap.org/search?q=Mumbai&format=json`
   - *Cost*: 100% Free (Rate limit: Max 1 request per second, requires custom User-Agent header).
2. **LocationIQ (Free Tier)**:
   - *Cost*: Free up to 5,000 requests per day (Great for search autocomplete).
3. **Photon by Komoot**:
   - *URL*: `https://photon.komoot.io/api/?q=berlin`
   - *Cost*: 100% Free open-source search API based on OpenStreetMap data.

### Adding Location Search to Your Map

Example code snippet using vanilla JavaScript + Nominatim:

```javascript
async function searchLocation(query) {
  const response = await fetch(
    `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json`,
    { headers: { 'User-Agent': 'BetterRoadsUserMap/1.0' } }
  );
  const data = await response.json();
  if (data.length > 0) {
    const { lat, lon } = data[0];
    map.setView([parseFloat(lat), parseFloat(lon)], 14); // Fly map to searched city!
  }
}
```

---

## 4. High-Performance Map Rendering: Bounding Box Queries

### The Problem: Rendering 1,000,000 Potholes

If your database has collected 1,000,000 road segments across the country, downloading all 1,000,000 records to the browser when a user opens the web page will freeze the browser and crash mobile devices.

### The Solution: `bbox` Spatial Queries

Instead of asking for all data, the map only asks for road segments **currently visible on the user's screen**.

Whenever the user pans or zooms the map, Leaflet provides the bounding box coordinates:

```javascript
const bounds = map.getBounds();
const minLat = bounds.getSouth();
const maxLat = bounds.getNorth();
const minLon = bounds.getWest();
const maxLon = bounds.getEast();
```

### Integrating BetterRoads Backend Endpoints

The BetterRoads backend already provides built-in `bbox` endpoints in [publicRoads.ts](file:///e:/darshi/betterroads/betterroads/backend/src/routes/publicRoads.ts):

1. **Get Visible Road Segments**:
   `GET /public/roads?minLat=18.90&maxLat=19.10&minLon=72.80&maxLon=73.00`
   Returns segments inside the box with their RQI score and polyline geometry:
   ```json
   {
     "ok": true,
     "segments": [
       {
         "segmentKey": "19.055:72.840",
         "rqi": 42.5,
         "geometry": [[19.055, 72.840], [19.056, 72.841]]
       }
     ]
   }
   ```

2. **Get Potholes & Swerves**:
   `GET /public/events?minLat=18.90&maxLat=19.10&minLon=72.80&maxLon=73.00&type=POTHOLE`

3. **Get Time-Series Dates**:
   `GET /public/timeline`
   Returns available historical dates for the time slider.

---

## 5. Step-by-Step 4-Week Learning & Implementation Roadmap

### Week 1: Leaflet Fundamentals & Basic Map Setup
- [ ] Learn HTML5, CSS3, and JavaScript ES6 basics (`fetch`, `async/await`, Promises).
- [ ] Include Leaflet CSS/JS via CDN (`<link rel="stylesheet" href="https://unpkg.com/leaflet/dist/leaflet.css" />`).
- [ ] Initialize map container `<div id="map"></div>` and center on your city.
- [ ] Add OpenStreetMap or CartoDB Positron tile layers.
- [ ] Practice drawing hardcoded markers and multi-color polylines.

### Week 2: Connecting Backend API & Spatial Rendering
- [ ] Learn how to use `fetch()` or TanStack Query (React Query) to call `/public/roads`.
- [ ] Listen to Leaflet's `moveend` event (`map.on('moveend', fetchVisibleRoads)`).
- [ ] Write a color function:
  ```typescript
  function getColorForRqi(rqi: number): string {
    if (rqi >= 75) return '#22c55e'; // Green (Good)
    if (rqi >= 45) return '#eab308'; // Yellow (Fair)
    return '#ef4444'; // Red (Poor)
  }
  ```
- [ ] Clear previous map layers and render new `L.polyline()` objects as the user pans.

### Week 3: Location Search Bar & Geocoding
- [ ] Build a search input box over the map canvas.
- [ ] Wire up Nominatim / Photon API to fetch coordinates when the user hits Enter.
- [ ] Smoothly animate the map to the searched coordinates (`map.flyTo([lat, lon], 14)`).
- [ ] Add popup tooltips showing street names and local pothole counts when clicking on a road.

### Week 4: Time-Slider & Historical Playback
- [ ] Add an HTML `<input type="range">` slider at the bottom of the dashboard.
- [ ] Fetch available dates from `/public/timeline`.
- [ ] Map slider movement to historical query parameter (`/public/roads?...&at=2026-08-01`).
- [ ] Watch the map dynamically change colors showing how road quality deteriorated or improved over time!
