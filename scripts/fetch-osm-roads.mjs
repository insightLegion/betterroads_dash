// Fetch real road geometry for the roads named in src/data/areas.js from
// OpenStreetMap via Overpass, and bake it to src/data/roadGeometry.json.
//
// One Overpass call per area, cached under scripts/.osm-cache/ so that
// re-running the name-matching costs nothing. Delete the cache to refetch.
//
//   node scripts/fetch-osm-roads.mjs
//
// Exits non-zero if any named road resolves to no geometry — an unmatched road
// must be visible, not silently replaced by a synthetic line.

import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { AREAS } from '../src/data/areas.js';

// The main endpoint 504s under load; these are the standard public mirrors.
const OVERPASS = [
  'https://overpass-api.de/api/interpreter',
  'https://overpass.kumi.systems/api/interpreter',
  'https://overpass.private.coffee/api/interpreter',
];
const CACHE_DIR = new URL('./.osm-cache/', import.meta.url);
const OUT = new URL('../src/data/roadGeometry.json', import.meta.url);
const RADIUS_M = 3000;

const HIGHWAYS = 'motorway|trunk|primary|secondary|tertiary|unclassified|residential|living_street';

// Names in areas.js are colloquial; OSM carries the official ones. Each entry
// lists extra spellings to accept for that label. Matching is on the
// normalised form (see norm()), so case/punctuation/spacing are already free.
const ALIASES = {
  'S.V. Road': ['swami vivekanand road', 'sv road', 's v road', 'swami vivekananda road'],
  'S.V. Road VP': ['swami vivekanand road', 'sv road', 's v road', 'swami vivekananda road'],
  'M.G. Road': ['mahatma gandhi road', 'mg road', 'm g road'],
  'L.T. Road': ['lokmanya tilak road', 'lt road', 'l t road', 'lokmanya tilak marg'],
  'L.J. Road': ['lady jamshedji road', 'lj road', 'l j road', 'lady jamshedji marg'],
  'LBS Marg': ['lal bahadur shastri marg', 'lbs marg', 'lal bahadur shastri road'],
  'Gokhale Road': ['gopalrao deshmukh marg', 'gokhale road north', 'gokhale road south', 'n c kelkar marg'],
  'Andheri-Kurla Road': ['andheri kurla road', 'andheri  kurla road'],
  'Kurla-Andheri Road': ['andheri kurla road', 'kurla andheri road'],
  'Sion-Kurla Road': ['sion kurla road', 'dharavi road'],
  'BKC Link Road': ['bandra kurla complex road', 'bkc road', 'bandra kurla link road'],
  'New Link Road': ['new link road', 'link road'],
  'Lokhandwala Marg': ['lokhandwala road', 'lokhandwala marg', 'lokhandwala complex road'],
  'Nehru Nagar Road': ['nehru nagar road'],
  'IC Colony Road': ['i c colony road', 'ic colony road'],
  'Pali Hill Road': ['pali hill road', 'pali hill', 'b j road'],
  'Senapati Bapat Marg': ['senapati bapat marg', 'senapati bapat road'],
  // Cadell Road was renamed; OSM carries only the new name, no parenthetical.
  'Cadell Road': ['swatantrya veer savarkar marg', 'veer savarkar marg', 'cadell road'],
  'Ranade Road': ['ranade road'],
  'Hanuman Road': ['hanuman road', 'hanuman marg'],
  'Nehru Road': ['nehru road', 'jawaharlal nehru road'],
  'Telang Road': ['telang road'],
  'Irla Road': ['irla road', 'irla society road'],
  'Shimpoli Road': ['shimpoli road'],
  'Chandavarkar Road': ['chandavarkar road', 'chandavarkar lane'],
  'Waterfield Road': ['waterfield road'],
  'Turner Road': ['turner road'],
  'Hill Road': ['hill road'],
  'Linking Road': ['linking road'],
  'Veera Desai Road': ['veera desai road', 'veera desai industrial estate road'],
};

const norm = (s) =>
  s
    .toLowerCase()
    .replace(/[.,'’]/g, '')
    .replace(/[-–—/]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

// Mumbai's OSM records renamed roads as "Official Marg (Colloquial Road)" —
// e.g. "Gurunanak Marg (Turner Road)", "Mathuradas Vasanji Road (Andheri Kurla
// Road)". Index a way under the full name AND both halves, so a colloquial
// label still finds it.
function keysForOsmName(name) {
  const full = norm(name);
  const keys = new Set([full]);
  const m = name.match(/^(.*?)\s*\((.+)\)\s*$/);
  if (m) {
    keys.add(norm(m[1]));
    keys.add(norm(m[2]));
  }
  return [...keys];
}

function candidatesFor(label) {
  const set = new Set([norm(label)]);
  for (const a of ALIASES[label] ?? []) set.add(norm(a));
  return [...set];
}

async function overpassFor(areaId, area, radius = RADIUS_M) {
  await mkdir(CACHE_DIR, { recursive: true });
  const suffix = radius === RADIUS_M ? '' : `-${radius}`;
  const cached = new URL(`${areaId}${suffix}.json`, CACHE_DIR);
  if (existsSync(cached)) return JSON.parse(await readFile(cached, 'utf8'));

  const q = `[out:json][timeout:90];
way(around:${radius},${area.lat},${area.lng})["highway"~"^(${HIGHWAYS})$"]["name"];
out geom;`;

  process.stdout.write(`  overpass ${areaId} ... `);
  let json = null;
  let lastErr = null;
  outer: for (let attempt = 0; attempt < 3; attempt++) {
    for (const endpoint of OVERPASS) {
      try {
        const res = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'User-Agent': 'better-roads-demo/0.1 (road geometry for a civic-tech demo)',
          },
          body: new URLSearchParams({ data: q }),
        });
        if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
        json = await res.json();
        break outer;
      } catch (e) {
        lastErr = `${new URL(endpoint).host}: ${e.message}`;
        process.stdout.write(`[${lastErr}] `);
        await new Promise((r) => setTimeout(r, 3000 * (attempt + 1)));
      }
    }
  }
  if (!json) throw new Error(`Overpass failed for ${areaId} on all mirrors — last: ${lastErr}`);
  if (!Array.isArray(json.elements)) throw new Error(`Overpass returned no elements array for ${areaId}`);
  await writeFile(cached, JSON.stringify(json));
  console.log(`${json.elements.length} named ways`);
  await new Promise((r) => setTimeout(r, 2000)); // be polite to a free endpoint
  return json;
}

function indexWays(osm) {
  const byName = new Map();
  for (const el of osm.elements) {
    if (el.type !== 'way' || !el.geometry || !el.tags?.name) continue;
    // Leaflet wants [lat, lng]; Overpass gives {lat, lon}.
    const line = el.geometry.map((p) => [p.lat, p.lon]);
    for (const k of keysForOsmName(el.tags.name)) {
      if (!byName.has(k)) byName.set(k, []);
      byName.get(k).push(line);
    }
  }
  return byName;
}

function matchRoad(byName, label) {
  const lines = [];
  for (const c of candidatesFor(label)) {
    for (const [k, v] of byName) {
      // exact normalised match, or the OSM name starts with the candidate
      // (catches "Hill Road" vs "Hill Road Bandra")
      if (k === c || k.startsWith(`${c} `)) lines.push(...v);
    }
  }
  return lines;
}

const out = {};
const unmatched = [];
let totalWays = 0;

// Pass 1 — 3 km around each ward centroid.
const pending = [];
for (const [areaId, area] of Object.entries(AREAS)) {
  const byName = indexWays(await overpassFor(areaId, area));
  for (const label of area.roads) {
    const lines = matchRoad(byName, label);
    if (lines.length === 0) {
      pending.push([areaId, area, label]);
      continue;
    }
    out[`${areaId}::${label}`] = lines;
    totalWays += lines.length;
  }
}

// Pass 2 — widen to 8 km for whatever pass 1 missed. Some of these roads are
// simply further from the centroid than 3 km; still an exact-name match, so a
// hit here is no less real.
if (pending.length) {
  console.log(`\n  widening to 8 km for ${pending.length} unmatched roads`);
  const wide = new Map();
  for (const [areaId, area, label] of pending) {
    if (!wide.has(areaId)) wide.set(areaId, indexWays(await overpassFor(areaId, area, 8000)));
    const lines = matchRoad(wide.get(areaId), label);
    if (lines.length === 0) {
      unmatched.push(`${areaId} :: ${label}`);
      continue;
    }
    out[`${areaId}::${label}`] = lines;
    totalWays += lines.length;
  }
}

// Roads with no geometry are recorded as null, NOT omitted and NOT faked — the
// UI reads this to say "geometry unavailable" instead of drawing a fake line.
for (const key of unmatched) out[key.replace(' :: ', '::')] = null;

await writeFile(OUT, JSON.stringify(out));

const wanted = Object.values(AREAS).reduce((n, a) => n + a.roads.length, 0);
const matched = wanted - unmatched.length;
console.log(`\nmatched ${matched}/${wanted} roads · ${totalWays} OSM ways`);
if (unmatched.length) {
  console.error(`\nNO GEOMETRY (${unmatched.length}) — recorded as null, shown as unavailable in the UI:`);
  for (const u of unmatched) console.error(`  ${u}`);
}
if (matched === 0) {
  console.error('\nNothing matched at all — the matcher or the endpoint is broken, not the data.');
  process.exit(1);
}
