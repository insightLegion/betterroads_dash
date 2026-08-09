import { createContext, useContext, useState, useCallback, useMemo, useEffect } from 'react';

const AppStateContext = createContext(null);

// history arrays have 12 entries (Apr 25 -> Apr 26). Default to the latest month.
const DEFAULT_MONTH_INDEX = 11;

export function AppStateProvider({ children }) {
  const getInitialScreen = () => {
    const hash = window.location.hash.replace('#', '');
    if (['login', 'profile', 'complaint', 'map'].includes(hash)) return hash;
    return 'map';
  };

  const [activeScreen, setActiveScreen] = useState(getInitialScreen);
  const [selectedAreaId, setSelectedAreaId] = useState(null);
  const [selectedRoad, setSelectedRoad] = useState(null);
  const [selectedMonthIndex, setSelectedMonthIndex] = useState(DEFAULT_MONTH_INDEX);

  const navigateTo = useCallback((screen, areaId) => {
    setActiveScreen(screen);
    window.location.hash = `#${screen}`;
    if (areaId !== undefined) setSelectedAreaId(areaId);
  }, []);

  useEffect(() => {
    const handleHash = () => {
      const h = window.location.hash.replace('#', '');
      if (['login', 'profile', 'complaint', 'map'].includes(h)) {
        setActiveScreen(h);
      }
    };
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  const value = useMemo(() => ({
    activeScreen, setActiveScreen,
    selectedAreaId, setSelectedAreaId,
    selectedRoad, setSelectedRoad,
    selectedMonthIndex, setSelectedMonthIndex,
    navigateTo
  }), [activeScreen, selectedAreaId, selectedRoad, selectedMonthIndex, navigateTo]);

  return (
    <AppStateContext.Provider value={value}>
      {children}
    </AppStateContext.Provider>
  );
}

export function useAppState() {
  const ctx = useContext(AppStateContext);
  if (!ctx) throw new Error('useAppState must be used within AppStateProvider');
  return ctx;
}
