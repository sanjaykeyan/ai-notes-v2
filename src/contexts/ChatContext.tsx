import { createContext, useContext, useState } from 'react';

interface ChatContextType {
  isChatOpen: boolean;
  toggleChat: () => void;
  setSelectedView?: (view: string) => void;
}

const ChatContext = createContext<ChatContextType>({
  isChatOpen: false,
  toggleChat: () => {},
});

export function ChatProvider({ children }: { children: React.ReactNode }) {
  const [isChatOpen, setIsChatOpen] = useState(false);

  const toggleChat = () => {
    setIsChatOpen(prev => !prev);
  };

  return (
    <ChatContext.Provider value={{ isChatOpen, toggleChat }}>
      {children}
    </ChatContext.Provider>
  );
}

export const useChat = () => useContext(ChatContext);
