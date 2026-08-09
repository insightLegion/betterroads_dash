# System Architectural Alternatives & Trade-Off Matrix

This document presents a comprehensive analysis of alternative technologies, architectural patterns, and design choices for BetterRoads. It evaluates why the current technologies were chosen and provides alternatives for future scaling or different budget constraints.

---

## Table of Contents

1. [Mobile Sensing Layer Alternatives](#1-mobile-sensing-layer-alternatives)
2. [Backend & API Framework Alternatives](#2-backend--api-framework-alternatives)
3. [Database & Spatial Keying Alternatives](#3-database--spatial-keying-alternatives)
4. [Mapping & Visualization Alternatives](#4-mapping--visualization-alternatives)
5. [Hosting & Infrastructure Trade-Off Matrix](#5-hosting--infrastructure-trade-off-matrix)

---

## 1. Mobile Sensing Layer Alternatives

| Option | Pros | Cons | Verdict / Best For |
| :--- | :--- | :--- | :--- |
| **React Native / Expo** *(Current Choice)* | • Single TypeScript codebase for Android & iOS<br>• Fast UI iteration<br>• Access to native accelerometer & GPS via Expo modules | • Sensor sampling capped at ~50 Hz on standard Android without native plugins<br>• Higher battery usage than pure native | **Best overall balance** for quick deployment and cross-platform support. |
| **Native Android (Kotlin) / iOS (Swift)** | • Maximum sensor sampling rates (up to 200 Hz)<br>• Direct background service integration (runs even when app is killed)<br>• Lower memory footprint | • Double the development effort (2 codebases)<br>• Requires separate Kotlin & Swift developers | **Best for high-precision municipal fleets** or dedicated hardware dongles. |
| **Edge AI (TensorFlow Lite on Device)** | • Machine learning model classifies complex road anomalies on-device<br>• Ignores phone handling noise automatically | • Higher battery consumption<br>• Requires collecting and labeling thousands of manual road training datasets | **Future upgrade path** as the data size grows. |

---

## 2. Backend & API Framework Alternatives

| Option | Pros | Cons | Verdict / Best For |
| :--- | :--- | :--- | :--- |
| **Node.js + Hono** *(Current Choice)* | • Blazingly fast startup & tiny footprint<br>• Full end-to-end TypeScript type safety<br>• Runs on Node, Bun, Cloudflare Workers, or Docker | • Younger ecosystem than Express.js | **Ideal choice** for ultra-fast REST APIs handling large JSON payloads. |
| **Express.js** | • The most popular Node.js web framework<br>• Millions of tutorials & middleware packages | • Slower execution speed<br>• Heavier memory overhead | Great for legacy projects, but outdated for modern TypeScript microservices. |
| **Python (FastAPI / Flask)** | • Built-in integration with data science tools (Pandas, NumPy, PyTorch)<br>• Easy AI model deployment | • Lower concurrency performance than Node.js/Go | **Best if backend primary job becomes machine learning reprocessing**. |
| **Go (Golang)** | • Exceptional concurrency (handles 100,000+ requests/sec easily)<br>• Tiny single binary output | • Steeper learning curve for web developers<br>• Verbose error handling | Best for massive enterprise scaling. |

---

## 3. Database & Spatial Keying Alternatives

| Option | Pros | Cons | Verdict / Best For |
| :--- | :--- | :--- | :--- |
| **Postgres + Quantized Cell Keys** *(Current Choice)* | • Extreme performance (simple string indexing on `"19.055:72.840"`)<br>• Zero complex GIS extensions required<br>• Works on any $5 basic PostgreSQL server | • Cell boundaries can split a road down the middle<br>• Two crossing roads in a cell share a key | **Best lightweight approach** for early-stage startup builds. |
| **PostgreSQL + PostGIS Extension** | • Industry standard for geographic information systems (GIS)<br>• Native spatial queries (`ST_DWithin`, `ST_Contains`, line clipping)<br>• True road geometry snapping | • Requires PostGIS extension installed on database server<br>• Higher memory & CPU usage during spatial queries | **Best long-term architecture** for municipal city council integrations. |
| **MongoDB (Geospatial Indexes)** | • Flexible JSON document schema<br>• Native `$near` and `$geoWithin` queries | • Harder to run analytical aggregation joins across journeys and devices | Good for simple event storage, weaker for complex road analytics. |

---

## 4. Mapping & Visualization Alternatives

| Option | Cost Model | Key Features | Recommendation |
| :--- | :--- | :--- | :--- |
| **OpenStreetMap + Leaflet.js** | **100% Free** | Lightweight, open-source, thousands of plugins. | **Strongly Recommended** for low-cost, open-source public dashboards. |
| **MapLibre GL JS** | **100% Free** (Open-source fork of Mapbox GL) | GPU-accelerated 3D vector tile rendering, ultra-smooth zooming. | **Best upgrade** if rendering >50,000 markers simultaneously. |
| **Google Maps JS API** | **$7.00 per 1,000 loads** | Familiar UI, satellite imagery, street view. | **Avoid for open public maps** due to high billing costs. |
| **Mapbox GL JS** | **$5.00 per 1,000 loads** | Beautiful custom styles, vector tiles. | Great aesthetics, but expensive for high-traffic public sites. |

---

## 5. Hosting & Infrastructure Trade-Off Matrix

```
       LOW COST / SELF-HOSTED                  FULLY MANAGED / SERVERLESS
  ┌───────────────────────────────┐        ┌───────────────────────────────┐
  │  Dokploy / Docker on VPS      │        │  Supabase + Render + Vercel   │
  │  • Cost: $5 - $10 / month     │  VS    │  • Cost: Free Tier → Pay/Use  │
  │  • Maintenance: You manage VPS│        │  • Maintenance: Zero Server   │
  └───────────────────────────────┘        └───────────────────────────────┘
```

- **Choose Dokploy / Docker VPS** if: You want total control over costs (fixed $5/month regardless of traffic spikes) and want to learn real DevOps.
- **Choose Render / Supabase / Vercel** if: You are a complete beginner who wants zero server management and fast one-click deployments.
