import React, { createContext, useContext, useState } from 'react';

interface PlaybackContextType {
  currentTime: number;
  setCurrentTime: (time: number) => void;
}

const PlaybackContext = createContext<PlaybackContextType | undefined>(undefined);

export function PlaybackProvider({ children }: { children: React.ReactNode }) {
  const [currentTime, setCurrentTime] = useState(0);

  return (
    <PlaybackContext.Provider value={{ currentTime, setCurrentTime }}>
      {children}
    </PlaybackContext.Provider>
  );
}

export function usePlayback() {
  const context = useContext(PlaybackContext);
  if (context === undefined) {
    throw new Error('usePlayback must be used within a PlaybackProvider');
  }
  return context;
}
