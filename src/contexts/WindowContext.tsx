import React, { createContext, useContext, useState } from 'react';

interface Window {
  id: string;
  appId: string;
  title: string;
  component: React.ReactNode;
  position: { x: number; y: number };
  size: { width: number; height: number };
  isMinimized: boolean;
  zIndex: number;
}

interface WindowContextType {
  windows: Window[];
  addWindow: (window: Omit<Window, 'id' | 'zIndex'>) => void;
  removeWindow: (id: string) => void;
  minimizeWindow: (id: string) => void;
  maximizeWindow: (id: string) => void;
  bringToFront: (id: string) => void;
  updateWindowPosition: (id: string, position: { x: number; y: number }) => void;
  updateWindowSize: (id: string, size: { width: number; height: number }) => void;
  toggleWindow: (appId: string, windowProps: Omit<Window, 'id' | 'zIndex' | 'appId'>) => void;
  getWindowByAppId: (appId: string) => Window | undefined;
}

const WindowContext = createContext<WindowContextType | undefined>(undefined);

export const WindowProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [windows, setWindows] = useState<Window[]>([]);
  const [maxZIndex, setMaxZIndex] = useState(1000);
  const [recentlyClosedApps, setRecentlyClosedApps] = useState<Set<string>>(new Set());

  const addWindow = (window: Omit<Window, 'id' | 'zIndex'>) => {
    const newZIndex = maxZIndex + 1;
    setMaxZIndex(newZIndex);
    setWindows(prev => [...prev, {
      ...window,
      id: Math.random().toString(36).substr(2, 9),
      zIndex: newZIndex
    }]);
  };

  const removeWindow = (id: string) => {
    const window = windows.find(w => w.id === id);
    if (window) {
      setRecentlyClosedApps(prev => new Set([...prev, window.appId]));
      setTimeout(() => {
        setRecentlyClosedApps(prev => {
          const newSet = new Set(prev);
          newSet.delete(window.appId);
          return newSet;
        });
      }, 500); // Clear after 500ms
    }
    setWindows(prev => prev.filter(window => window.id !== id));
  };

  const minimizeWindow = (id: string) => {
    setWindows(prev => prev.map(window => 
      window.id === id ? { ...window, isMinimized: true } : window
    ));
  };

  const maximizeWindow = (id: string) => {
    setWindows(prev => prev.map(window => 
      window.id === id ? { ...window, isMinimized: false } : window
    ));
  };

  const bringToFront = (id: string) => {
    const newZIndex = maxZIndex + 1;
    setMaxZIndex(newZIndex);
    setWindows(prev => prev.map(window => 
      window.id === id ? { ...window, zIndex: newZIndex } : window
    ));
  };

  const updateWindowPosition = (id: string, position: { x: number; y: number }) => {
    // Store the exact position values without any rounding or adjustment
    setWindows(prev => prev.map(window => 
      window.id === id ? {
        ...window,
        position: {
          x: position.x,
          y: position.y
        }
      } : window
    ));
  };

  const updateWindowSize = (id: string, size: { width: number; height: number }) => {
    setWindows(prev => prev.map(window => 
      window.id === id ? { ...window, size } : window
    ));
  };

  const getWindowByAppId = (appId: string) => {
    return windows.find(window => window.appId === appId);
  };

  const toggleWindow = (appId: string, windowProps: Omit<Window, 'id' | 'zIndex' | 'appId'>) => {
    // Don't reopen if the app was recently closed
    if (recentlyClosedApps.has(appId)) {
      return;
    }

    const existingWindow = getWindowByAppId(appId);
    
    if (existingWindow) {
      if (existingWindow.isMinimized) {
        maximizeWindow(existingWindow.id);
        bringToFront(existingWindow.id);
      } else {
        minimizeWindow(existingWindow.id);
      }
    } else {
      addWindow({
        ...windowProps,
        appId
      });
    }
  };

  return (
    <WindowContext.Provider
      value={{
        windows,
        addWindow,
        removeWindow,
        minimizeWindow,
        maximizeWindow,
        bringToFront,
        updateWindowPosition,
        updateWindowSize,
        toggleWindow,
        getWindowByAppId
      }}
    >
      {children}
    </WindowContext.Provider>
  );
};

export const useWindow = () => {
  const context = useContext(WindowContext);
  if (context === undefined) {
    throw new Error('useWindow must be used within a WindowProvider');
  }
  return context;
};
