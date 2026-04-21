import { createContext, useContext, useState, useCallback, useMemo } from 'react';

const AppStateContext = createContext(null);

export function AppStateProvider({ children }) {
  const [activeScreen, setActiveScreen] = useState('map');
  const [selectedAreaId, setSelectedAreaId] = useState(null);
  const [compareBeforeIndex, setCompareBeforeIndex] = useState(6);
  const [compareAfterIndex, setCompareAfterIndex] = useState(11);

  const navigateTo = useCallback((screen, areaId) => {
    setActiveScreen(screen);
    if (areaId !== undefined) setSelectedAreaId(areaId);
  }, []);

  const value = useMemo(() => ({
    activeScreen, setActiveScreen,
    selectedAreaId, setSelectedAreaId,
    compareBeforeIndex, setCompareBeforeIndex,
    compareAfterIndex, setCompareAfterIndex,
    navigateTo
  }), [activeScreen, selectedAreaId, compareBeforeIndex, compareAfterIndex, navigateTo]);

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
