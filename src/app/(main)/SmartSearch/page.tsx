"use client";

import { useState, useEffect } from "react";
import DashboardSidebar from "@/components/DashboardSidebar";
import DashboardTopbar from "@/components/DashboardTopbar";
import { Send, Filter } from "lucide-react";
import MeetingSelectorModal from "@/components/MeetingSelectorModal";

type Chat = {
  id: string;
  title: string;
  createdAt: Date;
};

export default function SmartSearch() {
  const [input, setInput] = useState("");
  const [chats, setChats] = useState<Chat[]>([]);
  const [selectedChat, setSelectedChat] = useState<string | null>(null);
  const [isMeetingSelectorOpen, setIsMeetingSelectorOpen] = useState(false);
  const [selectedMeetings, setSelectedMeetings] = useState<string[]>([]);

  useEffect(() => {
    // Load chats from API
    fetch("/api/chats")
      .then((res) => res.json())
      .then((data) => setChats(data));
  }, []);

  const createNewChat = async () => {
    const res = await fetch("/api/chats", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: "New Chat" }),
    });
    const newChat = await res.json();
    setChats([newChat, ...chats]);
    setSelectedChat(newChat.id);
  };

  return (
    <div className="flex h-screen overflow-hidden bg-[#f8f9fa] dark:bg-gray-900">
      <DashboardSidebar />

      <div
        className="flex-1 flex flex-col overflow-hidden"
        style={{ marginLeft: "calc(var(--sidebar-width) - 10px)" }}
      >
        <DashboardTopbar />

        <div className="flex-1 p-1 pl-0 overflow-hidden">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 h-full">
            <div className="flex h-full">
              {/* Left Pane - Chat History */}
              <div className="w-72 border-r border-gray-200 dark:border-gray-700 p-4">
                <button
                  onClick={createNewChat}
                  className="w-full px-4 py-2.5 mb-6 text-[14px] text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 font-medium"
                  style={{
                    fontFamily:
                      '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                  }}
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                  New Chat
                </button>
                <div className="space-y-1">
                  {chats.map((chat) => (
                    <div
                      key={chat.id}
                      onClick={() => setSelectedChat(chat.id)}
                      className={`p-3 text-[14px] rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer border border-transparent hover:border-gray-200 dark:hover:border-gray-600 transition-colors ${
                        selectedChat === chat.id
                          ? "bg-gray-50 dark:bg-gray-700/50 border-gray-200 dark:border-gray-600"
                          : ""
                      }`}
                      style={{
                        fontFamily:
                          '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                      }}
                    >
                      {chat.title}
                    </div>
                  ))}
                </div>
              </div>

              {/* Main Chat Area */}
              <div className="flex-1 flex flex-col">
                {/* Chat Messages */}
                <div className="flex-1 overflow-auto p-6">
                  <div className="max-w-3xl mx-auto">
                    {/* Empty state */}
                    <div className="h-full flex flex-col items-center justify-center text-center">
                      <div className="w-20 h-20 mb-6 bg-blue-50 dark:bg-blue-900/20 rounded-2xl flex items-center justify-center">
                        <svg
                          className="w-10 h-10 text-blue-500 dark:text-blue-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                          />
                        </svg>
                      </div>
                      <h3
                        className="text-[16px] font-semibold mb-3 text-gray-900 dark:text-gray-100"
                        style={{
                          fontFamily:
                            '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                        }}
                      >
                        Ask me anything about your meetings
                      </h3>
                      <p
                        className="text-[14px] text-gray-500 dark:text-gray-400 max-w-md"
                        style={{
                          fontFamily:
                            '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                        }}
                      >
                        Search across all your meeting transcripts and get
                        instant answers to your questions.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Input Area */}
                <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50">
                  <div className="max-w-3xl mx-auto relative">
                    <div className="flex gap-2">
                      <button
                        onClick={() => setIsMeetingSelectorOpen(true)}
                        className="px-3 py-2 text-sm bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-2"
                      >
                        <Filter className="w-4 h-4" />
                        {selectedMeetings.length
                          ? `${selectedMeetings.length} selected`
                          : "All meetings"}
                      </button>
                      <textarea
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Ask a question about your meetings..."
                        className="w-full p-4 pr-12 text-[14px] bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:text-gray-100 resize-none shadow-sm"
                        style={{
                          minHeight: "60px",
                          maxHeight: "200px",
                          fontFamily:
                            '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                        }}
                        rows={1}
                      />
                      <button
                        className="absolute right-3 bottom-3 p-2 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                        aria-label="Send message"
                      >
                        <Send className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>

                <MeetingSelectorModal
                  isOpen={isMeetingSelectorOpen}
                  onClose={() => setIsMeetingSelectorOpen(false)}
                  selectedMeetings={selectedMeetings}
                  onSelectMeetings={setSelectedMeetings}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
