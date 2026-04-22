import { Polygon, Tooltip } from 'react-leaflet';
import { AREAS, severityColorHex, scoreToSeverity } from '../../data/areas.js';

// Simplified rectangles around each area's centroid (~0.03° half-span).
// Real BMC ward GeoJSON is Phase 2+.
const HALF = 0.028;

function rectForArea(area) {
  const { lat, lng } = area;
  return [
    [lat - HALF, lng - HALF],
    [lat - HALF, lng + HALF],
    [lat + HALF, lng + HALF],
    [lat + HALF, lng - HALF],
  ];
}

export default function WardPolygons({ monthIndex, onSelect }) {
  return (
    <>
      {Object.entries(AREAS).map(([id, area]) => {
        const score = area.history[monthIndex] ?? area.score;
        const severity = scoreToSeverity(score);
        const color = severityColorHex(severity);
        return (
          <Polygon
            key={id}
            positions={rectForArea(area)}
            pathOptions={{
              color: color,
              weight: 1,
              fillColor: color,
              fillOpacity: 0.22,
            }}
            eventHandlers={{ click: () => onSelect(id) }}
          >
            <Tooltip direction="center" sticky>
              <div style={{ fontWeight: 500 }}>{area.name}</div>
              <div style={{ color: '#6b7280', fontSize: 11 }}>
                {score}/100 · {severity}
              </div>
            </Tooltip>
          </Polygon>
        );
      })}
    </>
  );
}
