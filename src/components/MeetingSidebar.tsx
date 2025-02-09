"use client";
import { 
  MagnifyingGlassIcon, 
  BookmarkIcon, 
  ChatBubbleLeftIcon,
  ChartBarIcon
} from "@heroicons/react/24/outline";
import { useChat } from '@/contexts/ChatContext';

export type ActiveTool = "search" | "bookmarks" | "sentiment" | "chat";

interface SidebarProps {
  selectedTool: ActiveTool;
  onToolSelect: (tool: ActiveTool) => void;
}

export default function MeetingSidebar({ selectedTool, onToolSelect }: SidebarProps) {
  const { toggleChat, isChatOpen } = useChat();

  const handleChatClick = () => {
    toggleChat();
    onToolSelect("chat");
  };

  const regularTools = [
    { id: 'search', icon: MagnifyingGlassIcon, label: 'Smart Filters' },
    { id: 'bookmarks', icon: BookmarkIcon, label: 'Bookmarks' },
    { id: 'sentiment', icon: ChartBarIcon, label: 'Sentiment Analysis' },
  ];

  return (
    <div className="h-full flex flex-col bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700">
      <nav className="p-2 space-y-2">
        {regularTools.map((tool) => (
          <button
            key={tool.id}
            onClick={() => onToolSelect(tool.id as ActiveTool)}
            className={`w-full p-3 rounded-md ${
              selectedTool === tool.id ? "bg-gray-100 dark:bg-gray-700" : ""
            } hover:bg-gray-50 dark:hover:bg-gray-700`}
          >
            <tool.icon className="h-5 w-5 text-gray-600 dark:text-gray-300" />
          </button>
        ))}
        
        {/* Separate chat button */}
        <button
          onClick={handleChatClick}
          className={`w-full p-3 rounded-md ${
            selectedTool === "chat" ? "bg-gray-100 dark:bg-gray-700" : ""
          } hover:bg-gray-50 dark:hover:bg-gray-700`}
        >
          <ChatBubbleLeftIcon className="h-5 w-5 text-gray-600 dark:text-gray-300" />
        </button>
      </nav>
    </div>
  );
}
