import { AppStateProvider, useAppState } from './context/AppState.jsx';
import Navbar from './components/Navbar.jsx';
import MapView from './screens/MapView.jsx';
import ComplaintView from './screens/ComplaintView.jsx';

function Shell() {
  const { activeScreen } = useAppState();
  const isMap = activeScreen === 'map';

  return (
    <div
      style={{
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        background: 'var(--surface-2)',
      }}
    >
      {!isMap && <Navbar />}
      <main
        key={activeScreen}
        className="screen-fade"
        style={{ flex: 1, minHeight: 0, position: 'relative', overflow: 'hidden' }}
      >
        {activeScreen === 'map' && <MapView />}
        {activeScreen === 'complaint' && <ComplaintView />}
      </main>
    </div>
  );
}

export default function App() {
  return (
    <AppStateProvider>
      <Shell />
    </AppStateProvider>
  );
}
