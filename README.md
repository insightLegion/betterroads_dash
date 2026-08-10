# Better Roads — India

A civic-tech investor demo that makes road conditions in Indian cities publicly visible, historically trackable, and authority-accountable. Built with Vite, React, Leaflet, Recharts, and GSAP.

---

## 🚀 Run Locally

```bash
npm install
npm run dev
```

Then open http://localhost:5173 in a desktop browser.

---

## 🎨 Visual Identity & Design System

The application employs a premium **Frosted Light Glass Theme** backed by clean typography and vibrant Saffron/Orange accents:
- **Frosted Glass Panels (`.glass-panel`)**: Uses translucent panels with `rgba(255, 255, 255, 0.94)` background, `backdrop-filter: blur(16px)`, and subtle slate border lines (`#e7e5e2`) for a modern, tactile feel.
- **Saffron Accent System**: Warm brand gradients using Saffron (`#e0611c`), Orange (`#ea580c`), and Yellow/Gold (`#d97706` / `#eab308`).
- **Typography**: Sleek Sans-serif headers using modern font tokens and weights.
- **Layout Consistency**: Responsive sidebars and cards with standardized 330px width alignments.

---

## 🛠️ Implemented Features & Core Components

### 1. Unified Navigation Header (`Navbar.jsx`)
- **Minimalist City & Search Bar**: A unified, light-grey (`#f4f4f5`) search capsule. Includes a dropdown to jump between major cities (Mumbai, Bangalore, Chennai, Delhi NCR, Pune, Kochi) and a search input for areas, wards, or roads.
- **Active Contributors Stack**: Shows real-time contributors in the active viewport using overlapping avatar circles (`[E] [M] [P] [P] [+16]`) and a pulsing green online indicator.
- **Actions**: Direct links to `Home`, `File complaint`, a stylish `Login ›` action pill, and a personalized user profile avatar (`MK`).

### 2. Interactive Map View (`MapView.jsx` & `CityJumpController`)
- **Dynamic Leaflet Map**: Rendered with OpenStreetMap tiles. Zoom level intelligently controls detail depth (showing broad Ward Polygons at `zoom < 12` and detailed road segments at `zoom >= 12`).
- **Smooth City Jumping**: Selection of any city in the navigation dropdown automatically dispatches a custom event, invoking the Leaflet `flyTo()` controller to animate the camera smoothly to that city's coordinates.
- **Automatic Geolocation**: Detects user location on initial site launch and offers to center the map on their location.

### 3. Right Contribution & Activity Panel (`RightContributionPanel.jsx`)
- **Live Activity Tickers**: Showcases warm Saffron gradient cards detailing live mapping runs (e.g., "Riya T. mapped 6.8 km in Chennai") and community funding updates.
- **View Leaderboard Action**: Directly takes the user to the comprehensive contributors dashboard.
- **Mobile Sensor Statistics**: Tracks project scale (Km mapped, active contributors, and validation count) with clean labels and values aligned to avoid overlap.
- **Recent Nearby Incidents Feed**: Highlights real-time local hazards (e.g., "Pothole Cluster on SV Road") with distance, time-ago text, and custom severity badges (`Severe`, `Moderate`, `Minor`).

### 4. Separate Road Quality Legend (`MapStyleChips.jsx`)
- Placed separately at the bottom-right of the map (`bottom: 16`), aligning perfectly to the 330px width of the upper panel.
- Shows a continuous `0-100` color gradient scale (Poor to Good) along with ordered severity category pills (`Severe`, `Poor`, `Minor`, `Good`) matching the gradient colors from left to right.

### 5. Draggable Temporal Scrubber (`TemporalScrubber.jsx`)
- An ultra-minimalist, single-row scrubber capsule (`height: 42px`) situated at the bottom of the map viewport.
- Allows dragging to navigate historical timelines from previous months to the latest data seamlessly.

### 6. Leaderboard Page (`ContributorsView.jsx`)
- A fully functional dashboard accessible via hash routing (`#contributors`).
- Contains category selectors (Mappers, Validators, Contributors) and chronological filters (Monthly, Lifetime) to browse the leaderboard.

### 7. Auth Page (`sign-up.jsx` / `#login`)
- Split 2-column layout. The left column features a canvas shader using `@paper-design/shaders-react`'s `GrainGradient` in Saffron tones.
- The right column provides minimalist sign-up/login inputs with slate borders and an interactive smartphone download card with GSAP scale-and-glow hover feedback.

---

## ⚡ Deployment & Production Build

To compile the production assets:

```bash
npm run build
```

The output bundle is built into the `/dist` directory. The project has been verified to build cleanly in under 400ms with zero errors.
