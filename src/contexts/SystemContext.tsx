import React, { createContext, useContext, useState } from 'react';

interface SystemState {
  version: string;
  isMuted: boolean;
  isMatrixEnabled: boolean;
  toggleMute: () => void;
  toggleMatrixEffect: () => void;
}

const SystemContext = createContext<SystemState | undefined>(undefined);

export const SystemProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isMuted, setIsMuted] = useState(false);
  const [isMatrixEnabled, setIsMatrixEnabled] = useState(true);

  const toggleMute = () => setIsMuted(prev => !prev);
  const toggleMatrixEffect = () => setIsMatrixEnabled(prev => !prev);

  return (
    <SystemContext.Provider
      value={{
        version: '1.0.0',
        isMuted,
        isMatrixEnabled,
        toggleMute,
        toggleMatrixEffect,
      }}
    >
      {children}
    </SystemContext.Provider>
  );
};

export const useSystem = () => {
  const context = useContext(SystemContext);
  if (context === undefined) {
    throw new Error('useSystem must be used within a SystemProvider');
  }
  return context;
};
