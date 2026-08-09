import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, useMap, useMapEvents } from 'react-leaflet';
import { AREAS } from '../data/areas.js';
import { useAppState } from '../context/AppState.jsx';
import Navbar from '../components/Navbar.jsx';
import LeftSidebar from './map/LeftSidebar.jsx';
import TemporalScrubber from './map/TemporalScrubber.jsx';
import ZoomControl from './map/ZoomControl.jsx';
import MapStyleChips from './map/MapStyleChips.jsx';
import WardPolygons from './map/WardPolygons.jsx';
import DynamicOsmRoads from './map/DynamicOsmRoads.jsx';

function FlyController({ target }) {
  const map = useMap();
  useEffect(() => {
    if (target) map.flyTo([target.lat, target.lng], Math.max(map.getZoom(), 14), { duration: 0.8 });
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

export default function MapView() {
  const {
    setSelectedAreaId,
    selectedRoad,
    setSelectedRoad,
    selectedMonthIndex,
  } = useAppState();
  const [layer, setLayer] = useState('condition');
  const [flyTarget, setFlyTarget] = useState(null);
  const [zoom, setZoom] = useState(11);

  const handlePickArea = (id) => {
    setSelectedRoad(null);
    setSelectedAreaId(id);
    setFlyTarget({ ...AREAS[id], ts: Date.now() });
  };

  const handleSelectRoad = (sel) => {
    setSelectedAreaId(null);
    setSelectedRoad(sel);
    const a = AREAS[sel.areaId];
    setFlyTarget({ ...a, ts: Date.now() });
  };

  const showWardPolygons = zoom < 12;
  const showRoadLines = zoom >= 12;

  return (
    <div style={{ position: 'absolute', inset: 0, display: 'flex' }}>
      <LeftSidebar onPickArea={handlePickArea} />

      <div style={{ flex: 1, minWidth: 0, position: 'relative' }}>
        <MapContainer
          center={[19.076, 72.8777]}
          zoom={11}
          minZoom={4}
          maxZoom={18}
          style={{ height: '100%', width: '100%' }}
          zoomControl={false}
        >
          {/* attributionControl is left ON deliberately: with it disabled the
              `attribution` prop below renders nowhere, and both the OSM tile
              usage policy and ODbL require the credit to be visible. */}
          <TileLayer
            url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />

          {showWardPolygons && (
            <WardPolygons monthIndex={selectedMonthIndex} onSelect={handlePickArea} />
          )}

          {showRoadLines && (
            <DynamicOsmRoads
              monthIndex={selectedMonthIndex}
              zoom={zoom}
              layer={layer}
              onSelectRoad={handleSelectRoad}
              selectedRoad={selectedRoad}
            />
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
