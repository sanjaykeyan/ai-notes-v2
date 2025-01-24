import React, { createContext, useContext, useState } from 'react';

interface PlaybackContextType {
  currentTime: number;
  setCurrentTime: (time: number) => void;
  seekTo: (time: number) => void;
  registerSeekCallback: (callback: (time: number) => void) => void;
}
const PlaybackContext = createContext<PlaybackContextType>({
  currentTime: 0,
  setCurrentTime: () => {},
  seekTo: () => {},
  registerSeekCallback: () => {},
});

export function PlaybackProvider({ children }: { children: React.ReactNode }) {
  const [currentTime, setCurrentTime] = useState(0);
  const [seekCallback, setSeekCallback] = useState<((time: number) => void) | null>(null);

  // Memoize the callback registration function
  const registerSeekCallback = React.useCallback((callback: (time: number) => void) => {
    setSeekCallback(() => callback);
  }, []); // Empty dependency array since this function never needs to change

  const seekTo = React.useCallback((time: number) => {
    if (seekCallback) {
      seekCallback(time);
    }
  }, [seekCallback]);

  const value = React.useMemo(() => ({
    currentTime,
    setCurrentTime,
    seekTo,
    registerSeekCallback,
  }), [currentTime, seekTo, registerSeekCallback]);

  return (
    <PlaybackContext.Provider value={value}>
      {children}
    </PlaybackContext.Provider>
  );
}

export const usePlayback = () => useContext(PlaybackContext);
