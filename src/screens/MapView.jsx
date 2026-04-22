import { useEffect, useMemo, useState } from 'react';
import { MapContainer, TileLayer, CircleMarker, Tooltip, useMap, useMapEvents } from 'react-leaflet';
import { AREAS, severityColorHex, scoreToSeverity } from '../data/areas.js';
import { useAppState } from '../context/AppState.jsx';
import Navbar from '../components/Navbar.jsx';
import LeftSidebar from './map/LeftSidebar.jsx';
import TemporalScrubber from './map/TemporalScrubber.jsx';
import ZoomControl from './map/ZoomControl.jsx';
import MapStyleChips from './map/MapStyleChips.jsx';
import WardPolygons from './map/WardPolygons.jsx';
import RoadSegments from './map/RoadSegments.jsx';

function complaintsColor(c) {
  const min = 5, max = 50;
  const t = Math.min(1, Math.max(0, (c - min) / (max - min)));
  const g = { r: 0x63, g: 0x99, b: 0x22 };
  const s = { r: 0xE2, g: 0x4B, b: 0x4A };
  const r = Math.round(g.r + (s.r - g.r) * t);
  const gr = Math.round(g.g + (s.g - g.g) * t);
  const b = Math.round(g.b + (s.b - g.b) * t);
  return `rgb(${r}, ${gr}, ${b})`;
}

function getMarkerColor(area, layer, monthIndex) {
  const monthScore = area.history[monthIndex] ?? area.score;
  const monthSeverity = scoreToSeverity(monthScore);
  if (layer === 'condition') return severityColorHex(monthSeverity);
  if (layer === 'complaints') return complaintsColor(area.complaints);
  if (layer === 'history') {
    const past = area.history[Math.max(0, monthIndex - 6)];
    const delta = monthScore - past;
    if (delta >= 10) return '#639922';
    if (delta <= -10) return '#E24B4A';
    return '#9ca3af';
  }
  return '#9ca3af';
}

function FlyController({ target }) {
  const map = useMap();
  useEffect(() => {
    if (target) map.flyTo([target.lat, target.lng], Math.max(map.getZoom(), 13), { duration: 0.8 });
  }, [target, map]);
  return null;
}

function ZoomWatcher({ onZoomChange }) {
  const map = useMap();
  useEffect(() => {
    onZoomChange(map.getZoom());
  }, [map, onZoomChange]);
  useMapEvents({
    zoomend: () => onZoomChange(map.getZoom()),
  });
  return null;
}

function AreaMarker({ id, area, layer, onClick, monthIndex }) {
  const [hovered, setHovered] = useState(false);
  const color = getMarkerColor(area, layer, monthIndex);
  const monthScore = area.history[monthIndex] ?? area.score;
  const monthSeverity = scoreToSeverity(monthScore);
  return (
    <CircleMarker
      center={[area.lat, area.lng]}
      radius={hovered ? 18 : 14}
      pathOptions={{
        color: '#ffffff',
        weight: 2,
        fillColor: color,
        fillOpacity: 0.95,
      }}
      eventHandlers={{
        click: () => onClick(id),
        mouseover: () => setHovered(true),
        mouseout: () => setHovered(false),
      }}
    >
      <Tooltip direction="top" offset={[0, -8]}>
        <div style={{ fontWeight: 500 }}>{area.name}</div>
        <div style={{ color: '#6b7280', fontSize: 11 }}>
          {monthScore}/100 · {monthSeverity}
        </div>
      </Tooltip>
    </CircleMarker>
  );
}

export default function MapView() {
  const { selectedAreaId, setSelectedAreaId, selectedMonthIndex } = useAppState();
  const [layer, setLayer] = useState('condition');
  const [flyTarget, setFlyTarget] = useState(null);
  const [zoom, setZoom] = useState(11);

  const entries = useMemo(() => Object.entries(AREAS), []);

  const handlePick = (id) => {
    setSelectedAreaId(id);
    setFlyTarget({ ...AREAS[id], ts: Date.now() });
  };

  const showWardPolygons = zoom < 12;
  const showAreaCircles = zoom >= 12 && zoom < 15;
  const showRoadSegments = zoom >= 15;

  return (
    <div style={{ position: 'absolute', inset: 0, display: 'flex' }}>
      <LeftSidebar onPickArea={handlePick} />

      <div style={{ flex: 1, minWidth: 0, position: 'relative' }}>
        <MapContainer
          center={[19.076, 72.8777]}
          zoom={11}
          minZoom={10}
          maxZoom={17}
          style={{ height: '100%', width: '100%' }}
          zoomControl={false}
          attributionControl={false}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution="&copy; OpenStreetMap"
          />

          {showWardPolygons && (
            <WardPolygons monthIndex={selectedMonthIndex} onSelect={handlePick} />
          )}

          {showAreaCircles &&
            entries.map(([id, area]) => (
              <AreaMarker
                key={id}
                id={id}
                area={area}
                layer={layer}
                onClick={handlePick}
                monthIndex={selectedMonthIndex}
              />
            ))}

          {showRoadSegments && (
            <RoadSegments monthIndex={selectedMonthIndex} onSelect={handlePick} />
          )}

          <FlyController target={flyTarget} />
          <ZoomWatcher onZoomChange={setZoom} />
          <ZoomControl />
        </MapContainer>

        <Navbar variant="floating" />
        <MapStyleChips layer={layer} setLayer={setLayer} />
        <TemporalScrubber />
      </div>
    </div>
  );
}
