import { useEffect, useMemo, useRef, useState } from 'react';
import { MapContainer, TileLayer, CircleMarker, Tooltip, useMap } from 'react-leaflet';
import { AREAS, severityColorHex } from '../data/areas.js';
import { useAppState } from '../context/AppState.jsx';
import SearchBar from './map/SearchBar.jsx';
import LayerToggle from './map/LayerToggle.jsx';
import Legend from './map/Legend.jsx';
import SidePanel from './map/SidePanel.jsx';

function complaintsColor(c) {
  const min = 5, max = 50;
  const t = Math.min(1, Math.max(0, (c - min) / (max - min)));
  // interpolate between good and severe
  const g = { r: 0x63, g: 0x99, b: 0x22 };
  const s = { r: 0xE2, g: 0x4B, b: 0x4A };
  const r = Math.round(g.r + (s.r - g.r) * t);
  const gr = Math.round(g.g + (s.g - g.g) * t);
  const b = Math.round(g.b + (s.b - g.b) * t);
  return `rgb(${r}, ${gr}, ${b})`;
}

function getMarkerColor(area, layer) {
  if (layer === 'condition') return severityColorHex(area.severity);
  if (layer === 'complaints') return complaintsColor(area.complaints);
  if (layer === 'history') {
    const past = area.history[5];
    const delta = area.score - past;
    if (delta >= 10) return '#639922';
    if (delta <= -10) return '#E24B4A';
    return '#9ca3af';
  }
  return '#9ca3af';
}

function FlyController({ target }) {
  const map = useMap();
  useEffect(() => {
    if (target) map.flyTo([target.lat, target.lng], 13, { duration: 0.8 });
  }, [target, map]);
  return null;
}

function AreaMarker({ id, area, layer, onClick }) {
  const [hovered, setHovered] = useState(false);
  const color = getMarkerColor(area, layer);
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
        <div style={{ color: '#6b7280', fontSize: 11 }}>{area.score}/100 · {area.severity}</div>
      </Tooltip>
    </CircleMarker>
  );
}

export default function MapView() {
  const { selectedAreaId, setSelectedAreaId } = useAppState();
  const [layer, setLayer] = useState('condition');
  const [flyTarget, setFlyTarget] = useState(null);

  const entries = useMemo(() => Object.entries(AREAS), []);

  const handleSelect = (id) => {
    setSelectedAreaId(id);
    setFlyTarget({ ...AREAS[id], ts: Date.now() });
  };

  return (
    <div style={{ position: 'absolute', inset: 0 }}>
      <MapContainer
        center={[19.076, 72.8777]}
        zoom={11}
        style={{ height: '100%', width: '100%' }}
        zoomControl={false}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; OpenStreetMap'
        />
        {entries.map(([id, area]) => (
          <AreaMarker key={id} id={id} area={area} layer={layer} onClick={setSelectedAreaId} />
        ))}
        <FlyController target={flyTarget} />
      </MapContainer>

      <SearchBar onSelect={handleSelect} />
      <LayerToggle layer={layer} setLayer={setLayer} />
      <Legend />

      {selectedAreaId && (
        <SidePanel areaId={selectedAreaId} onClose={() => setSelectedAreaId(null)} />
      )}
    </div>
  );
}
