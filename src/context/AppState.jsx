import { createContext, useContext, useState, useCallback, useMemo } from 'react';

const AppStateContext = createContext(null);

// history arrays have 12 entries (Apr 25 -> Apr 26). Default to the latest month.
const DEFAULT_MONTH_INDEX = 11;

export function AppStateProvider({ children }) {
  const [activeScreen, setActiveScreen] = useState('map');
  const [selectedAreaId, setSelectedAreaId] = useState(null);
  const [selectedRoad, setSelectedRoad] = useState(null); // { areaId, roadName } | null
  const [selectedMonthIndex, setSelectedMonthIndex] = useState(DEFAULT_MONTH_INDEX);

  const navigateTo = useCallback((screen, areaId) => {
    setActiveScreen(screen);
    if (areaId !== undefined) setSelectedAreaId(areaId);
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
