import { Polyline, Tooltip } from 'react-leaflet';
import { AREAS, severityColorHex, scoreToSeverity } from '../../data/areas.js';
import ROAD_GEOMETRY from '../../data/roadGeometry.json';

// Road geometry is real OpenStreetMap way geometry, baked by
// `node scripts/fetch-osm-roads.mjs` into src/data/roadGeometry.json.
// Keys are `${areaId}::${roadName}`; the value is an array of polylines
// (a road is usually several OSM ways), or `null` when OSM has no road under
// that name — those are NOT drawn, because a straight line between two guessed
// points is worse than an absent one.
export function geometryFor(areaId, roadName) {
  return ROAD_GEOMETRY[`${areaId}::${roadName}`] ?? null;
}

function scoreForRoad(areaScore, salt) {
  const delta = ((salt * 37) % 21) - 10;
  return Math.max(0, Math.min(100, areaScore + delta));
}

function complaintsColor(c) {
  const min = 5, max = 60;
  const t = Math.min(1, Math.max(0, (c - min) / (max - min)));
  const g = { r: 0x63, g: 0x99, b: 0x22 };
  const s = { r: 0xE2, g: 0x4B, b: 0x4A };
  const r = Math.round(g.r + (s.r - g.r) * t);
  const gr = Math.round(g.g + (s.g - g.g) * t);
  const b = Math.round(g.b + (s.b - g.b) * t);
  return `rgb(${r}, ${gr}, ${b})`;
}

function colorForLayer(layer, area, roadScore, monthIndex) {
  if (layer === 'complaints') return complaintsColor(area.complaints);
  if (layer === 'history') {
    const past = area.history[Math.max(0, monthIndex - 6)];
    const now = area.history[monthIndex] ?? area.score;
    const delta = now - past;
    if (delta >= 10) return '#639922';
    if (delta <= -10) return '#E24B4A';
    return '#9ca3af';
  }
  return severityColorHex(scoreToSeverity(roadScore));
}

export default function RoadSegments({ monthIndex, zoom, layer, onSelectRoad, selectedRoad }) {
  const baseWeight = zoom >= 15 ? 8 : zoom >= 14 ? 7 : zoom >= 13 ? 6 : 5;

  return (
    <>
      {Object.entries(AREAS).flatMap(([areaId, area]) => {
        const areaScore = area.history[monthIndex] ?? area.score;

        return area.roads.flatMap((roadName, i) => {
          const lines = geometryFor(areaId, roadName);
          if (!lines) return [];

          const score = scoreForRoad(areaScore, roadName.length + i);
          const severity = scoreToSeverity(score);
          const color = colorForLayer(layer, area, score, monthIndex);
          const isSelected =
            selectedRoad && selectedRoad.areaId === areaId && selectedRoad.roadName === roadName;
          const weight = isSelected ? baseWeight + 4 : baseWeight;

          // A white casing under the colour keeps the severity legible against
          // the OSM basemap, which already draws roads in yellows and greys.
          return [
            <Polyline
              key={`${areaId}-${roadName}-casing`}
              positions={lines}
              interactive={false}
              pathOptions={{
                color: '#ffffff',
                weight: weight + 4,
                opacity: 0.85,
                lineCap: 'round',
                lineJoin: 'round',
              }}
            />,
            <Polyline
              key={`${areaId}-${roadName}`}
              positions={lines}
              pathOptions={{
                color,
                weight,
                opacity: isSelected ? 1 : 0.92,
                lineCap: 'round',
                lineJoin: 'round',
              }}
              eventHandlers={{
                click: () => onSelectRoad({ areaId, roadName }),
              }}
            >
              <Tooltip direction="top" offset={[0, -4]} sticky>
                <div style={{ fontWeight: 500 }}>{roadName}</div>
                <div style={{ color: '#6b7280', fontSize: 11 }}>
                  {score}/100 · {severity} · {area.name}
                </div>
              </Tooltip>
            </Polyline>,
          ];
        });
      })}
    </>
  );
}
