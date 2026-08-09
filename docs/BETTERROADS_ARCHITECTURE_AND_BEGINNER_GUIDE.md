# BetterRoads: Architecture, Sensor Engine, & Tech Beginner's Handbook

Welcome to the **BetterRoads Technical & Architecture Guide**. This document is designed specifically for web developers who are expanding into backend services, databases, DevOps, mobile sensor processing, and cloud deployment. 

Whether you are trying to understand how your mobile phone detects a pothole in real time or learning what a database container actually does, this guide explains every single component from **absolute scratch** with practical analogies, equations, and code references from the BetterRoads workspace.

---

## Table of Contents

1. [High-Level System Overview & Data Lifecycle](#1-high-level-system-overview--data-lifecycle)
2. [What Are These Tools & Services? (The Tech Beginner's Dictionary)](#2-what-are-these-tools--services-the-tech-beginners-dictionary)
3. [Mobile Sensing Engine: How Pothole Detection Works](#3-mobile-sensing-engine-how-pothole-detection-works)
   - [Sensors 101: Accelerometer vs. Gyroscope](#sensors-101-accelerometer-vs-gyroscope)
   - [Gravity Isolation (Low-Pass Filtering)](#gravity-isolation-low-pass-filtering)
   - [Vehicle Noise Subtraction](#vehicle-noise-subtraction)
   - [Sliding Window RMS & Event Classification](#sliding-window-rms--event-classification)
   - [Road Quality Index (RQI) Scoring](#road-quality-index-rqi-scoring)
4. [Backend APIs & Ingestion Mechanics](#4-backend-apis--ingestion-mechanics)
   - [What is an API?](#what-is-an-api)
   - [Ingestion Endpoint (`/user/mobile/traveldata`)](#ingestion-endpoint-usermobiletraveldata)
   - [Zod Validation & Idempotency](#zod-validation--idempotency)
5. [Databases 101: How BetterRoads Stores Data](#5-databases-101-how-betterroads-stores-data)
   - [What is a Relational Database?](#what-is-a-relational-database)
   - [PostgreSQL & Drizzle ORM](#postgresql--drizzle-orm)
   - [BetterRoads Database Schema Breakdown](#betterroads-database-schema-breakdown)
   - [Spatial Quantization Grid (`segmentKeyFor`)](#spatial-quantization-grid-segmentkeyfor)
6. [DevOps, Docker, & Deployment Basics](#6-devops-docker--deployment-basics)
   - [What is DevOps & Deployment?](#what-is-devops--deployment)
   - [Docker & Containers Explained](#docker--containers-explained)
   - [Reverse Proxies (Nginx / Traefik)](#reverse-proxies-nginx--traefik)
   - [Hosting Options for Beginners](#hosting-options-for-beginners)

---

## 1. High-Level System Overview & Data Lifecycle

BetterRoads consists of 4 main components working in harmony:

```
┌─────────────────┐       HTTP POST Payload        ┌──────────────────────┐
│  Mobile App     │  ────────────────────────────> │  Backend API Server  │
│ (React Native)  │   (JSON: GPS, Events, Segments)│  (Hono + Node.js)    │
└─────────────────┘                                └──────────┬───────────┘
                                                              │
                                                   Drizzle ORM│ SQL Queries
                                                              v
┌─────────────────┐        HTTP GET Requests       ┌──────────────────────┐
│ Admin Dashboard │  <──────────────────────────── │ PostgreSQL Database  │
│ (Vite + React)  │   (Aggregated Road Stats)      │ (Stores Journeys &   │
└─────────────────┘                                │  Road Snapshots)     │
                                                   └──────────────────────┘
```

1. **Mobile App (`/mobile`)**: Runs on an Android or iOS device inside a vehicle. As you drive, its sensors sample motion at 50 times per second ($50\text{ Hz}$), detect jolts (potholes/bumps) and sharp turns (swerves), aggregate road quality into 300-meter segments, and record GPS coordinates.
2. **Backend API (`/backend`)**: A lightweight, fast TypeScript web server built with **Hono**. It receives the end-of-trip batch payload, validates it for corrupt data, stores raw sensor records, updates running averages for road quality, and exposes endpoints for dashboards.
3. **Database (`/backend/src/db`)**: A **PostgreSQL** relational database. It permanently holds registered devices, trip metadata, individual pothole events, spatial road grid cells, and daily snapshot histories.
4. **Admin Dashboard (`/dashboard`)**: A web interface built with **Vite, React, and Tailwind CSS**. City managers and road engineers open this website to inspect live road health, signups, device activity, and historical trends.

---

## 2. What Are These Tools & Services? (The Tech Beginner's Dictionary)

| Tool / Concept | What it is | Why do we need it in BetterRoads? | Practical Analogy |
| :--- | :--- | :--- | :--- |
| **Node.js** | A JavaScript runtime environment for servers. | Allows us to write server code in TypeScript/JavaScript instead of needing Java or C++. | The engine inside a car that keeps the web server running. |
| **Hono** | A lightweight web framework for Node.js. | Receives requests from the mobile app and dashboard, routes them to functions, and sends JSON back. | The mailroom sorting incoming mail into correct department boxes. |
| **PostgreSQL** | A relational database management system (RDBMS). | Permanently saves trip records, pothole locations, and road scores so data isn't lost when the server restarts. | A digital filing cabinet with organized drawers (tables) and indexes. |
| **Drizzle ORM** | Object-Relational Mapper for TypeScript. | Lets us query PostgreSQL using plain TypeScript code instead of writing raw SQL strings by hand. | A translator between JavaScript code and database queries. |
| **Zod** | TypeScript schema validation library. | Verifies incoming mobile app JSON to ensure coordinates are valid numbers and fields aren't missing. | A bouncer checking IDs at the entrance of a club. |
| **Docker** | Containerization software. | Packages our backend, database, and web apps with their dependencies so they run identically everywhere. | A shipping container that fits standard cargo ships regardless of country. |
| **Traefik / Nginx**| Reverse Proxy / Web Server. | Directs incoming internet traffic (HTTP/HTTPS) on port 80/443 to the right app container and manages SSL. | A front-desk receptionist directing visitors to the right office room. |
| **Expo / React Native** | Cross-platform mobile development framework. | Lets us write one mobile codebase in TypeScript that accesses hardware sensors on both Android and iOS. | A universal adapter plug that works in any country's power socket. |

---

## 3. Mobile Sensing Engine: How Pothole Detection Works

The core intelligence of BetterRoads lives in [sensorEngine.ts](file:///e:/darshi/betterroads/betterroads/mobile/app/src/sensorEngine.ts). It takes raw, noisy motion data from phone hardware and transforms it into clean road quality metrics.

### Sensors 101: Accelerometer vs. Gyroscope

- **Accelerometer**: Measures linear acceleration (change in speed) along 3 axes ($X, Y, Z$) in meters per second squared ($\text{m/s}^2$).
  - **$X$-axis**: Left-to-right tilting/sliding.
  - **$Y$-axis**: Forward acceleration and braking.
  - **$Z$-axis**: Vertical up-and-down movement (jolts, bumps, potholes).
- **Gyroscope**: Measures rotational velocity around axes in radians per second ($\text{rad/s}$).
  - **$Z$-rotation (Yaw)**: Turning the steering wheel left or right.

### Gravity Isolation (Low-Pass Filtering)

When a phone is resting flat on a table, the accelerometer reads $Z \approx +9.81\text{ m/s}^2$ because Earth's gravity pulls on it. If a car hits a pothole, the phone experiences both gravity *and* the vertical impact force.

To detect *only* the impact force, we must subtract gravity. But gravity's direction relative to the phone changes as the vehicle tilts or mounts change. We isolate gravity using a **Low-Pass Filter**:

$$\mathbf{g}_t = \alpha \cdot \mathbf{g}_{t-1} + (1 - \alpha) \cdot \mathbf{a}_t$$

Where:
- $\mathbf{a}_t = (x_t, y_t, z_t)$ is the raw accelerometer reading.
- $\alpha = 0.8$ (`GRAVITY_ALPHA`). Higher values make gravity estimation smoother and slower to react to quick bumps.
- The isolated dynamic force on the $Z$-axis is: $\text{dynamicZ} = |z_t - g_z|$.

### Vehicle Noise Subtraction

A motorcycle vibrates much more than a luxury sedan. If we used a single fixed bump threshold, every motorcycle trip would look like a nightmare of continuous potholes.

BetterRoads defines vehicle-specific baseline vibration levels in [vehicles.ts](file:///e:/darshi/betterroads/betterroads/mobile/app/src/vehicles.ts):
- **Sedan / Car**: $1.2\text{ m/s}^2$
- **Auto Rickshaw**: $3.5\text{ m/s}^2$
- **Motorcycle / Bike**: $4.0\text{ m/s}^2$

The engine subtracts this floor before evaluating bumps:

$$\text{cleanZ} = \max(0, \text{dynamicZ} - \text{baselineRMS})$$

### Sliding Window RMS & Event Classification

To smooth single-sample noise spikes, samples pass through a $500\text{ ms}$ sliding window to compute Root Mean Square (RMS) acceleration:

$$\text{RMS} = \sqrt{\frac{1}{N} \sum_{i=1}^{N} (\text{cleanZ}_i)^2}$$

Events are classified when vehicle speed exceeds $8\text{ km/h}$ (`MIN_EVENT_SPEED_KMH`):
- **BUMP**: Triggered if $\text{cleanZ} > 12\text{ m/s}^2$.
- **POTHOLE**: Triggered if $\text{cleanZ} > 22\text{ m/s}^2$.
- **SWERVE**: Triggered if $\text{Gyro}_z > 0.6\text{ rad/s}$ while speed exceeds $15\text{ km/h}$.

A $1000\text{ ms}$ cooldown (`EVENT_COOLDOWN_MS`) prevents one deep pothole from generating 15 duplicate event notifications.

### Road Quality Index (RQI) Scoring

As a vehicle travels every $300\text{ meters}$, the engine calculates a **Road Quality Index (RQI)** score from `0` (horrible) to `100` (pristine):

$$\text{RQI} = \text{clamp}_{10, 100} \left( 100 - \text{roughnessPenalty} - \text{eventPenalty} \right)$$

- $\text{roughnessPenalty} = \min(40, \text{avgRMS} \times 10)$
- $\text{eventPenalty} = \min(50, \text{eventCount} \times 12)$

A smooth highway scores $90 - 100$ (Green). A bumpy road scores $50 - 74$ (Yellow). A broken road riddled with potholes drops below $45$ (Red).

---

## 4. Backend APIs & Ingestion Mechanics

### What is an API?

An **API (Application Programming Interface)** is a structured set of rules that lets different software applications talk to each other over HTTP. 
Think of a restaurant menu:
- **Client (Mobile App)**: The customer making an order.
- **Request (POST `/user/mobile/traveldata`)**: The order placed with specific parameters (JSON data).
- **Server (Backend)**: The kitchen preparing the response.
- **Response (`200 OK`)**: The food delivered back to the customer.

### Ingestion Endpoint (`/user/mobile/traveldata`)

Defined in [traveldata.ts](file:///e:/darshi/betterroads/betterroads/backend/src/routes/traveldata.ts). When a user completes a drive, the mobile app batches all collected data into a single payload containing:
1. **Device Info**: UUID, OS platform, app version.
2. **Journey Summary**: Start/end time, total distance, vehicle type, overall RQI score.
3. **Segments**: Array of $300\text{m}$ road stretches with local RQI scores.
4. **Events**: List of detected potholes/bumps with exact lat/lon coordinates.

### Zod Validation & Idempotency

- **Zod Schema Validation**: If a mobile phone sends a string for latitude instead of a number, Zod immediately catches the mismatch and returns a `400 Bad Request` before bad data corrupts the database.
- **Idempotency**: Network drops during uploads often cause mobile apps to retry sending the same trip twice. BetterRoads checks if `journey.id` already exists in PostgreSQL. If it exists, the server returns `duplicate: true` without re-inserting or double-counting stats.

---

## 5. Databases 101: How BetterRoads Stores Data

### What is a Relational Database?

A relational database organizes data into **tables** made of rows and columns, similar to spreadsheets in Microsoft Excel. Each row has a unique identifier called a **Primary Key** (`id`), and tables link to each other using **Foreign Keys**.

### PostgreSQL & Drizzle ORM

- **PostgreSQL**: An industry-standard, rock-solid relational database.
- **Drizzle ORM**: Rather than writing SQL commands manually (`CREATE TABLE journeys...`), we write TypeScript schemas in [schema.ts](file:///e:/darshi/betterroads/betterroads/backend/src/db/schema.ts), and Drizzle automatically generates and executes SQL migrations.

### BetterRoads Database Schema Breakdown

```
 ┌─────────────────┐       1 : N       ┌──────────────────┐
 │     devices     │ ────────────────> │     journeys     │
 └─────────────────┘                   └────────┬─────────┘
                                                │
                                                │ 1 : N
                                                v
┌──────────────────┐                   ┌──────────────────┐
│  road_segments   │                   │   road_events    │
└────────┬─────────┘                   └──────────────────┘
         │
         │ 1 : N
         v
┌──────────────────┐
│segment_snapshots │
└──────────────────┘
```

1. `devices`: Stores registered app installs (identified by random UUIDs, preserving user privacy).
2. `journeys`: Stores individual trips ($A \to B$) with vehicle type, start/end points, distance, and total RQI.
3. `journey_raw`: Stores verbatim JSON payloads (including full GPS traces) for future AI model retraining.
4. `road_events`: Stores precise pothole, bump, and swerve locations.
5. `road_segments`: Stores aggregated running RQI scores for geographic grid cells.
6. `segment_snapshots`: Stores daily historic snapshots of road scores for time-slider playback on maps.

### Spatial Quantization Grid (`segmentKeyFor`)

Instead of requiring expensive spatial database extensions (like PostGIS), BetterRoads uses a brilliant mathematical trick in [roadSegments.ts](file:///e:/darshi/betterroads/betterroads/backend/src/lib/roadSegments.ts):

```typescript
export const CELL_SIZE_DEG = 0.001; // ~111 meters

export function segmentKeyFor(lat: number, lon: number): string {
  const qLat = (Math.floor(lat / CELL_SIZE_DEG) * CELL_SIZE_DEG).toFixed(3);
  const qLon = (Math.floor(lon / CELL_SIZE_DEG) * CELL_SIZE_DEG).toFixed(3);
  return `${qLat}:${qLon}`;
}
```

By rounding coordinates to 3 decimal places ($0.001^\circ \approx 111\text{ meters}$), any coordinate pair inside that $111\text{m} \times 111\text{m}$ area converts to the exact same key string (e.g., `"19.055:72.840"`). This enables simple, hyper-fast SQL string lookups without complex GIS math!

---

## 6. DevOps, Docker, & Deployment Basics

### What is DevOps & Deployment?

- **Deployment**: Taking the code running on your laptop and putting it onto a remote server in a data center so anyone on the internet can access it.
- **DevOps (Development + Operations)**: The tools and practices used to automate building, testing, packaging, and deploying software continuously.

### Docker & Containers Explained

On your computer, you might have Node v20 installed, but a cloud server might run Node v18 or have different operating system libraries, causing `"it worked on my machine"` bugs.

**Docker solves this!** A Docker container packages:
1. Your application code
2. The operating system dependencies (Linux Alpine/Debian)
3. Node.js runtime and packages

When you run `docker compose up`, Docker creates isolated containers for your backend server and PostgreSQL database that behave identically on your laptop, a $5 VPS, or AWS!

### Reverse Proxies (Nginx / Traefik)

When users type `https://betterroads.org`, their web request hits port `443` on your server. But your Hono backend might be running internally on port `3000`, and your admin dashboard on port `8080`.

A **Reverse Proxy** (like Nginx or Traefik):
1. Listens on external internet ports (`80` HTTP and `443` HTTPS).
2. Manages SSL certificates (HTTPS encryption via Let's Encrypt).
3. Forwards requests to `api.betterroads.org` $\to$ Backend Container (`:3000`).
4. Forwards requests to `admin.betterroads.org` $\to$ Dashboard Container (`:8080`).

### Hosting Options for Beginners

| Hosting Service | Setup Complexity | Cost | Best For |
| :--- | :--- | :--- | :--- |
| **Dokploy** (Used in `README.md`) | Low / Medium | Free (Self-hosted on cheap $5/mo VPS) | Full control over Docker containers on Hetzner / DigitalOcean. |
| **Render / Railway** | Very Low (Click to Deploy) | Free Tier / $5/mo | Complete beginners who don't want to manage Linux servers. |
| **Supabase** | Very Low | Free Tier | Replacing custom backend/Postgres with managed database services. |
| **Vercel / Netlify** | Ultra Low | Free | Hosting the static frontend Admin Dashboard and Web Apps. |

---

## Summary & Next Steps

Now that you understand the complete inner workings of BetterRoads—from mobile sensors to PostgreSQL grid cells and Docker deployment—you are ready to explore building a low-cost, open-source mapping interface!

Proceed to **`docs/USER_FACING_OPEN_MAPS_DASHBOARD_BLUEPRINT.md`** to learn how to build a public road health map using OpenStreetMap and Leaflet.js.
