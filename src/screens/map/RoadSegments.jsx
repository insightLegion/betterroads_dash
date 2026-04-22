import { Polyline, Tooltip } from 'react-leaflet';
import { AREAS, severityColorHex, scoreToSeverity } from '../../data/areas.js';

// Spread the area's listed roads as short polylines radiating from the centroid
// so they read as distinct segments at zoom >= 15.
const RADIUS = 0.006; // ~650m from centroid
const SEGMENT_HALF = 0.0025; // ~270m half-length

function segmentFor(area, index, count) {
  const angle = (index / count) * Math.PI * 2;
  const cx = area.lat + Math.cos(angle) * RADIUS;
  const cy = area.lng + Math.sin(angle) * RADIUS;
  // Segment direction rotated 90° from radial so it looks like a road
  const perp = angle + Math.PI / 2;
  const dx = Math.cos(perp) * SEGMENT_HALF;
  const dy = Math.sin(perp) * SEGMENT_HALF;
  return [
    [cx - dx, cy - dy],
    [cx + dx, cy + dy],
  ];
}

// Deterministic per-road score derived from the area's monthly score so
// segments vary but track the temporal scrubber.
function scoreForRoad(areaScore, salt) {
  const delta = ((salt * 37) % 21) - 10; // -10..+10
  return Math.max(0, Math.min(100, areaScore + delta));
}

export default function RoadSegments({ monthIndex, onSelect }) {
  return (
    <>
      {Object.entries(AREAS).flatMap(([id, area]) => {
        const areaScore = area.history[monthIndex] ?? area.score;
        const roads = area.roads.slice(0, 5);
        return roads.map((road, i) => {
          const score = scoreForRoad(areaScore, road.length + i);
          const severity = scoreToSeverity(score);
          const color = severityColorHex(severity);
          return (
            <Polyline
              key={`${id}-${road}`}
              positions={segmentFor(area, i, roads.length)}
              pathOptions={{
                color,
                weight: 6,
                opacity: 0.9,
                lineCap: 'round',
              }}
              eventHandlers={{ click: () => onSelect(id) }}
            >
              <Tooltip direction="top" offset={[0, -4]} sticky>
                <div style={{ fontWeight: 500 }}>{road}</div>
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
