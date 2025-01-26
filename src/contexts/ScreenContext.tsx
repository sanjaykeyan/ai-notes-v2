import { createContext, useContext, useState, ReactNode } from 'react';

export type ScreenType = 'filters' | 'summary' | 'transcript';

interface ScreenContextType {
  activeScreen: ScreenType;
  setActiveScreen: (screen: ScreenType) => void;
}

const ScreenContext = createContext<ScreenContextType | undefined>(undefined);

// Make sure to export these components
export const ScreenProvider = ({ children }: { children: ReactNode }) => {
  const [activeScreen, setActiveScreen] = useState<ScreenType>('summary');

  return (
    <ScreenContext.Provider value={{ activeScreen, setActiveScreen }}>
      {children}
    </ScreenContext.Provider>
  );
};

export const useScreen = () => {
  const context = useContext(ScreenContext);
  if (!context) {
    throw new Error('useScreen must be used within a ScreenProvider');
  }
  return context;
};
