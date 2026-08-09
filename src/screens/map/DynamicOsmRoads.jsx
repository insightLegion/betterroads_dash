import { useEffect, useState, useRef, useCallback } from 'react';
import { Polyline, Tooltip, useMap, useMapEvents } from 'react-leaflet';
import { AREAS, severityColorHex, scoreToSeverity } from '../../data/areas.js';
import ROAD_GEOMETRY from '../../data/roadGeometry.json';

const OVERPASS_ENDPOINTS = [
  'https://overpass-api.de/api/interpreter',
  'https://overpass.kumi.systems/api/interpreter',
  'https://overpass.private.coffee/api/interpreter',
];

function scoreForRoadName(name, monthIndex) {
  const normName = name.toLowerCase();
  for (const [, area] of Object.entries(AREAS)) {
    const areaScore = area.history[monthIndex] ?? area.score;
    for (let i = 0; i < area.roads.length; i++) {
      const r = area.roads[i].toLowerCase();
      if (normName.includes(r) || r.includes(normName)) {
        const salt = normName.length + i;
        const delta = ((salt * 37) % 21) - 10;
        return Math.max(15, Math.min(95, areaScore + delta));
      }
    }
  }
  // Hash-based score for unlisted roads in view
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = (hash << 5) - hash + name.charCodeAt(i);
  const base = 50 + (Math.abs(hash) % 45);
  return base;
}

export default function DynamicOsmRoads({ monthIndex, zoom, layer, onSelectRoad, selectedRoad }) {
  const map = useMap();
  const [dynamicRoads, setDynamicRoads] = useState([]);
  const [loading, setLoading] = useState(false);
  const cacheRef = useRef(new Map());
  const fetchingRef = useRef(false);

  // Load pre-baked roads first as instant initial baseline
  const staticRoadList = useRef([]);
  if (staticRoadList.current.length === 0) {
    const list = [];
    Object.entries(AREAS).forEach(([areaId, area]) => {
      area.roads.forEach((roadName, i) => {
        const lines = ROAD_GEOMETRY[`${areaId}::${roadName}`];
        if (lines) {
          list.push({
            id: `static-${areaId}-${roadName}`,
            name: roadName,
            areaId,
            areaName: area.name,
            positions: lines,
            isStatic: true,
          });
        }
      });
    });
    staticRoadList.current = list;
  }

  const fetchOsmBbox = useCallback(async () => {
    if (!map || map.getZoom() < 12 || fetchingRef.current) return;

    const bounds = map.getBounds();
    const s = bounds.getSouth().toFixed(3);
    const w = bounds.getWest().toFixed(3);
    const n = bounds.getNorth().toFixed(3);
    const e = bounds.getEast().toFixed(3);
    const bboxKey = `${s},${w},${n},${e}`;

    if (cacheRef.current.has(bboxKey)) return;
    cacheRef.current.set(bboxKey, true);

    const query = `[out:json][timeout:20];
(
  way["highway"~"motorway|trunk|primary|secondary|tertiary|unclassified|residential|living_street"](${s},${w},${n},${e});
);
out geometry;`;

    fetchingRef.current = true;
    setLoading(true);

    try {
      let data = null;
      for (const endpoint of OVERPASS_ENDPOINTS) {
        try {
          const res = await fetch(endpoint, {
            method: 'POST',
            body: `data=${encodeURIComponent(query)}`,
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          });
          if (res.ok) {
            data = await res.json();
            break;
          }
        } catch {
          // try next mirror
        }
      }

      if (data && data.elements) {
        const newRoads = [];
        data.elements.forEach((way) => {
          if (way.geometry && way.geometry.length > 1) {
            const name = way.tags?.name || way.tags?.ref || 'Local Street';
            const positions = way.geometry.map((pt) => [pt.lat, pt.lon]);
            newRoads.push({
              id: `osm-${way.id}`,
              name,
              positions,
              highway: way.tags?.highway || 'road',
            });
          }
        });

        setDynamicRoads((prev) => {
          const existingIds = new Set(prev.map((r) => r.id));
          const filteredNew = newRoads.filter((r) => !existingIds.has(r.id));
          return [...prev, ...filteredNew];
        });
      }
    } catch (err) {
      console.warn('Overpass API fetch error:', err);
    } finally {
      fetchingRef.current = false;
      setLoading(false);
    }
  }, [map]);

  useEffect(() => {
    fetchOsmBbox();
  }, [fetchOsmBbox]);

  useMapEvents({
    moveend: fetchOsmBbox,
    zoomend: fetchOsmBbox,
  });

  const baseWeight = zoom >= 15 ? 8 : zoom >= 14 ? 7 : zoom >= 13 ? 6 : 5;

  // Combine static fallback roads with dynamically fetched OSM roads
  const allRoadsToRender = [...staticRoadList.current, ...dynamicRoads];

  return (
    <>
      {allRoadsToRender.map((road) => {
        const score = scoreForRoadName(road.name, monthIndex);
        const severity = scoreToSeverity(score);
        const color = severityColorHex(severity);
        const isSelected =
          selectedRoad && selectedRoad.roadName === road.name;
        const weight = isSelected ? baseWeight + 4 : baseWeight;

        return (
          <g key={road.id}>
            {/* White casing line for OSM basemap contrast */}
            <Polyline
              positions={road.positions}
              interactive={false}
              pathOptions={{
                color: '#ffffff',
                weight: weight + 4,
                opacity: 0.85,
                lineCap: 'round',
                lineJoin: 'round',
              }}
            />
            {/* Colored RQI telemetry line */}
            <Polyline
              positions={road.positions}
              pathOptions={{
                color,
                weight,
                opacity: isSelected ? 1 : 0.92,
                lineCap: 'round',
                lineJoin: 'round',
              }}
              eventHandlers={{
                click: () =>
                  onSelectRoad({
                    areaId: road.areaId || 'custom',
                    roadName: road.name,
                  }),
              }}
            >
              <Tooltip direction="top" offset={[0, -4]} sticky>
                <div style={{ fontWeight: 600, fontSize: 12 }}>{road.name}</div>
                <div style={{ color: '#6b7280', fontSize: 11, marginTop: 2 }}>
                  RQI: <strong style={{ color }}>{score}/100</strong> · {severity}
                </div>
              </Tooltip>
            </Polyline>
          </g>
        );
      })}
    </>
  );
}
