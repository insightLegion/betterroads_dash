import { AppStateProvider, useAppState } from './context/AppState.jsx';
import Navbar from './components/Navbar.jsx';
import MapView from './screens/MapView.jsx';
import ComplaintView from './screens/ComplaintView.jsx';
import ProfileView from './screens/ProfileView.jsx';
import ContributorsView from './screens/ContributorsView.jsx';

import { AuthComponent } from './components/ui/sign-up.jsx';

function Shell() {
  const { activeScreen } = useAppState();
  const isMap = activeScreen === 'map';
  const isLogin = activeScreen === 'login';

  if (isLogin) {
    return <AuthComponent brandName="BetterRoads" />;
  }

  return (
    <div
      style={{
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        background: 'var(--surface-2)',
      }}
    >
      {!isMap && activeScreen !== 'profile' && activeScreen !== 'contributors' && <Navbar />}
      <main
        key={activeScreen}
        className="screen-fade"
        style={{ flex: 1, minHeight: 0, position: 'relative', overflow: 'hidden' }}
      >
        {activeScreen === 'map' && <MapView />}
        {activeScreen === 'complaint' && <ComplaintView />}
        {activeScreen === 'profile' && <ProfileView />}
        {activeScreen === 'contributors' && <ContributorsView />}
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
