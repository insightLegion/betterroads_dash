import { Polyline, Tooltip } from 'react-leaflet';
import { AREAS, severityColorHex, scoreToSeverity } from '../../data/areas.js';

// Road segments spread out from each area's centroid so that at zoom 12–17
// the map reads as a grid of colored streets rather than a single dot.
const RADIUS = 0.009; // ~1 km from centroid
const SEGMENT_HALF = 0.004; // ~440 m half-length

function segmentFor(area, index, count) {
  const angle = (index / count) * Math.PI * 2 + (index * 0.3); // jitter
  const cx = area.lat + Math.cos(angle) * RADIUS;
  const cy = area.lng + Math.sin(angle) * RADIUS;
  const perp = angle + Math.PI / 2;
  const dx = Math.cos(perp) * SEGMENT_HALF;
  const dy = Math.sin(perp) * SEGMENT_HALF;
  return [
    [cx - dx, cy - dy],
    [cx + dx, cy + dy],
  ];
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
        const roads = area.roads;
        return roads.map((roadName, i) => {
          const score = scoreForRoad(areaScore, roadName.length + i);
          const severity = scoreToSeverity(score);
          const color = colorForLayer(layer, area, score, monthIndex);
          const isSelected =
            selectedRoad && selectedRoad.areaId === areaId && selectedRoad.roadName === roadName;

          return (
            <Polyline
              key={`${areaId}-${roadName}`}
              positions={segmentFor(area, i, roads.length)}
              pathOptions={{
                color,
                weight: isSelected ? baseWeight + 4 : baseWeight,
                opacity: isSelected ? 1 : 0.92,
                lineCap: 'round',
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
            </Polyline>
          );
        });
      })}
    </>
  );
}
