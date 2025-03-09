"use client";

import { useState, useEffect, useRef } from "react";
import DashboardSidebar from "@/components/DashboardSidebar";
import DashboardTopbar from "@/components/DashboardTopbar";
import {
  Send,
  Filter,
  Loader2,
  MessageSquare,
  PlusCircle,
  Sparkles,
  User,
  Bot,
  X,
  ChevronLeft,
  Search,
} from "lucide-react";
import MeetingSelectorModal from "@/components/MeetingSelectorModal";
import { toast } from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";

type Chat = {
  id: string;
  title: string;
  createdAt: Date;
};

type Message = {
  id: string;
  content: string;
  role: "user" | "assistant";
  createdAt: Date;
};

export default function SmartSearch() {
  const [input, setInput] = useState("");
  const [chats, setChats] = useState<Chat[]>([]);
  const [selectedChat, setSelectedChat] = useState<string | null>(null);
  const [isMeetingSelectorOpen, setIsMeetingSelectorOpen] = useState(false);
  const [selectedMeetings, setSelectedMeetings] = useState<string[]>([]);
  const [selectedMeetingsInfo, setSelectedMeetingsInfo] = useState<
    Array<{
      id: string;
      title: string;
    }>
  >([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const [sidebarVisible, setSidebarVisible] = useState(true);
  const [searchValue, setSearchValue] = useState("");
  const [typingText, setTypingText] = useState("");
  const [typingComplete, setTypingComplete] = useState(false);
  const fullText = "Ask me anything about your meetings";

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

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    if (selectedMeetings.length === 0) {
      toast.error("Please select at least one meeting first");
      return;
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      content: input.trim(),
      role: "user",
      createdAt: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userMessage.content,
          selectedMeetings,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to get response");
      }

      const assistantMessage: Message = {
        id: Date.now().toString(),
        content: data.response, // Changed from data.message to data.response
        role: "assistant",
        createdAt: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error: any) {
      console.error("Error:", error);
      const errorMessage: Message = {
        id: Date.now().toString(),
        content:
          error.message || "Sorry, something went wrong. Please try again.",
        role: "assistant",
        createdAt: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleMeetingSelection = async (meetingIds: string[]) => {
    try {
      setSelectedMeetings(meetingIds);

      if (meetingIds.length === 0) {
        setSelectedMeetingsInfo([]);
        return;
      }

      const queryString = meetingIds.join(",");
      const response = await fetch(
        `/api/SmartSearch?meetingIds=${queryString}`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch meeting info");
      }

      const meetings = await response.json();
      setSelectedMeetingsInfo(meetings);
      // Removed onClose() call as it's handled by the modal component
    } catch (error) {
      console.error("Error fetching meeting info:", error);
      toast.error("Failed to fetch meeting information");
      setSelectedMeetingsInfo([]);
    }
  };

  // Auto-resize textarea with improved performance
  const resizeTextarea = () => {
    const textarea = inputRef.current;
    if (textarea) {
      // Store scroll position
      const chatContainer = chatContainerRef.current;
      const scrollPos = chatContainer?.scrollTop;

      // Reset height to get accurate scrollHeight
      textarea.style.height = "44px";
      const scrollHeight = textarea.scrollHeight;
      const newHeight = Math.min(scrollHeight, 200);
      textarea.style.height = `${newHeight}px`;

      // Find the input container and adjust its position
      const container = textarea.closest(".input-expand-container");
      if (container instanceof HTMLElement) {
        const extraHeight = Math.max(0, newHeight - 44);
        container.style.marginTop = extraHeight ? `-${extraHeight}px` : "0";
        container.style.paddingTop = extraHeight ? `${extraHeight}px` : "0";
      }

      // Restore scroll position
      if (chatContainer && scrollPos) {
        chatContainer.scrollTop = scrollPos;
      }
    }
  };

  // Format date to readable format
  const formatDate = (date: Date) => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return "Today";
    } else if (date.toDateString() === yesterday.toDateString()) {
      return "Yesterday";
    } else {
      return date.toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
        year:
          date.getFullYear() !== today.getFullYear() ? "numeric" : undefined,
      });
    }
  };

  // Filter chats based on search
  const filteredChats = chats.filter((chat) =>
    searchValue
      ? chat.title.toLowerCase().includes(searchValue.toLowerCase())
      : true
  );

  useEffect(() => {
    resizeTextarea();
  }, [input]);

  // Typing animation effect
  useEffect(() => {
    if (messages.length === 0) {
      setTypingText("");
      setTypingComplete(false);

      let i = 0;
      const typingInterval = setInterval(() => {
        if (i < fullText.length) {
          setTypingText((prev) => prev + fullText.charAt(i));
          i++;
        } else {
          setTypingComplete(true);
          clearInterval(typingInterval);
        }
      }, 50); // Adjust speed here (lower = faster)

      return () => clearInterval(typingInterval);
    }
  }, [messages.length]);

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
            <div className="flex h-full overflow-hidden">
              {/* Left Pane - Chat History - Now with AnimatePresence for smooth transitions */}
              <AnimatePresence initial={false}>
                {sidebarVisible && (
                  <motion.div
                    className="w-72 border-r border-gray-200 dark:border-gray-700 flex flex-col"
                    initial={{ width: 0, opacity: 0 }}
                    animate={{ width: "18rem", opacity: 1 }}
                    exit={{ width: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="p-3 border-b border-gray-200 dark:border-gray-700">
                      <button
                        onClick={createNewChat}
                        className="w-full px-3 py-2 mb-3 text-[14px] text-white bg-blue-600 rounded-lg hover:bg-blue-700 active:bg-blue-800 transition-colors flex items-center justify-center gap-2 font-medium shadow-sm"
                      >
                        <PlusCircle className="w-4 h-4" />
                        New Chat
                      </button>

                      {/* Search chats input */}
                      <div className="relative mt-1">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Search className="h-4 w-4 text-gray-400" />
                        </div>
                        <input
                          type="text"
                          value={searchValue}
                          onChange={(e) => setSearchValue(e.target.value)}
                          placeholder="Search chats..."
                          className="block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 py-2 pl-10 pr-3 text-sm text-gray-900 dark:text-gray-100 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                        {searchValue && (
                          <button
                            className="absolute inset-y-0 right-0 pr-3 flex items-center"
                            onClick={() => setSearchValue("")}
                          >
                            <X className="h-3.5 w-3.5 text-gray-400 hover:text-gray-500" />
                          </button>
                        )}
                      </div>
                    </div>

                    <div className="flex-1 overflow-y-auto p-2">
                      {filteredChats.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-40 text-center text-gray-500 dark:text-gray-400 text-sm py-8">
                          {searchValue ? (
                            <>
                              <div className="w-10 h-10 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mb-2">
                                <Search className="w-5 h-5 text-gray-400" />
                              </div>
                              <p>No chats match your search</p>
                              <button
                                onClick={() => setSearchValue("")}
                                className="mt-2 text-blue-500 hover:underline text-xs"
                              >
                                Clear search
                              </button>
                            </>
                          ) : (
                            <>
                              <div className="w-10 h-10 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mb-2">
                                <MessageSquare className="w-5 h-5 text-gray-400" />
                              </div>
                              <p>No chat history yet</p>
                              <p className="text-xs mt-1">
                                Start a new conversation!
                              </p>
                            </>
                          )}
                        </div>
                      ) : (
                        <div className="space-y-1">
                          {filteredChats.map((chat) => {
                            // Group chats by date
                            const chatDate = new Date(chat.createdAt);
                            const formattedDate = formatDate(chatDate);

                            return (
                              <motion.div
                                key={chat.id}
                                onClick={() => setSelectedChat(chat.id)}
                                className={`p-3 text-[14px] rounded-lg cursor-pointer border transition-all duration-100 group ${
                                  selectedChat === chat.id
                                    ? "bg-blue-50 dark:bg-blue-900/30 border-blue-200 dark:border-blue-900"
                                    : "border-transparent hover:bg-gray-50 dark:hover:bg-gray-700/40"
                                }`}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                              >
                                <div className="flex items-center gap-2.5 mb-1">
                                  <MessageSquare
                                    className={`w-4 h-4 ${
                                      selectedChat === chat.id
                                        ? "text-blue-500"
                                        : "text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-300"
                                    }`}
                                  />
                                  <span
                                    className={`truncate flex-1 ${
                                      selectedChat === chat.id
                                        ? "text-blue-700 dark:text-blue-300 font-medium"
                                        : "text-gray-800 dark:text-gray-200"
                                    }`}
                                  >
                                    {chat.title}
                                  </span>
                                </div>
                                <div className="ml-6 text-[11px] text-gray-500 dark:text-gray-400 flex items-center">
                                  <span>{formattedDate}</span>
                                </div>
                              </motion.div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Main Chat Area with improved layout */}
              <div className="flex-1 flex flex-col overflow-hidden relative">
                {/* Toggle sidebar button */}
                <button
                  onClick={() => setSidebarVisible((prev) => !prev)}
                  className="absolute left-4 top-4 p-1.5 rounded-lg bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600 z-10 shadow-sm"
                  title={sidebarVisible ? "Hide sidebar" : "Show sidebar"}
                >
                  <ChevronLeft
                    className={`h-4 w-4 text-gray-500 dark:text-gray-400 transition-transform ${
                      sidebarVisible ? "" : "transform rotate-180"
                    }`}
                  />
                </button>

                {/* Selected Meetings Display with improved styling */}
                {selectedMeetingsInfo.length > 0 && (
                  <div className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/60 px-4 py-2.5 flex items-center">
                    <div className="text-xs text-gray-500 dark:text-gray-400 flex flex-wrap gap-1.5 items-center ml-10">
                      <span className="font-medium">Searching:</span>
                      <div className="flex flex-wrap gap-1.5 items-center">
                        {selectedMeetingsInfo.map((meeting) => (
                          <span
                            key={meeting.id}
                            className="inline-flex items-center px-2 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-xs"
                          >
                            {meeting.title}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Chat Messages with improved styling and animations */}
                <div
                  className="flex-1 overflow-y-auto overflow-x-hidden p-6 bg-slate-50/60 dark:bg-gray-850/30"
                  ref={chatContainerRef}
                >
                  <div className="max-w-3xl mx-auto relative">
                    {messages.length === 0 ? (
                      <div className="h-full flex flex-col items-center justify-center text-center py-12 mt-6">
                        <div className="w-20 h-20 mb-6 bg-blue-50 dark:bg-blue-900/20 rounded-full flex items-center justify-center shadow-sm">
                          <Sparkles className="w-10 h-10 text-blue-500 dark:text-blue-400" />
                        </div>
                        <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-gray-100 min-h-[32px]">
                          {typingText}
                          {!typingComplete && (
                            <span className="inline-block w-1 h-5 ml-0.5 bg-blue-500 dark:bg-blue-400 animate-pulse" />
                          )}
                        </h3>
                        <motion.p
                          initial={{ opacity: 0 }}
                          animate={{ opacity: typingComplete ? 1 : 0 }}
                          transition={{ duration: 0.5 }}
                          className="text-[15px] text-gray-500 dark:text-gray-400 max-w-md leading-relaxed"
                        >
                          Search across all your meeting transcripts and get
                          instant answers to your questions.
                        </motion.p>
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{
                            opacity: typingComplete ? 1 : 0,
                            y: typingComplete ? 0 : 10,
                          }}
                          transition={{ duration: 0.5 }}
                          className="mt-8 flex flex-col gap-3 items-center"
                        >
                          <button
                            onClick={() => setIsMeetingSelectorOpen(true)}
                            className="px-5 py-3 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors flex items-center gap-2.5 text-sm font-medium shadow-sm border border-blue-100 dark:border-blue-800"
                          >
                            <Filter className="w-4 h-4" />
                            Select meetings to search
                          </button>
                        </motion.div>
                      </div>
                    ) : (
                      <div className="space-y-6 w-full">
                        {messages.map((message, index) => (
                          <motion.div
                            key={message.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: index * 0.08 }}
                            className={`flex items-end gap-2 ${
                              message.role === "user"
                                ? "justify-end"
                                : "justify-start"
                            }`}
                          >
                            {message.role === "assistant" && (
                              <div className="flex-shrink-0 h-8 w-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mt-auto">
                                <Bot className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                              </div>
                            )}

                            <div
                              className={`max-w-[85%] min-w-0 rounded-2xl p-4 ${
                                message.role === "user"
                                  ? "bg-blue-500 text-white shadow-sm"
                                  : "bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 shadow-sm"
                              }`}
                            >
                              <p className="text-[15px] whitespace-pre-wrap leading-relaxed break-words">
                                {message.content}
                              </p>
                              <div
                                className={`text-[11px] mt-1.5 text-right flex items-center justify-end gap-1.5 ${
                                  message.role === "user"
                                    ? "text-blue-200"
                                    : "text-gray-400 dark:text-gray-500"
                                }`}
                              >
                                <span className="text-xs opacity-80">
                                  {new Date(
                                    message.createdAt
                                  ).toLocaleTimeString([], {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  })}
                                </span>
                              </div>
                            </div>

                            {message.role === "user" && (
                              <div className="flex-shrink-0 h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center mt-auto">
                                <User className="h-4 w-4 text-white" />
                              </div>
                            )}
                          </motion.div>
                        ))}
                        <div ref={messagesEndRef} />
                        {isLoading && (
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="flex justify-start items-end gap-2"
                          >
                            <div className="flex-shrink-0 h-8 w-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                              <Bot className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                            </div>
                            <div className="bg-white dark:bg-gray-700 rounded-2xl px-4 py-3 flex items-center shadow-sm">
                              <div className="flex space-x-1.5">
                                <div className="w-2 h-2 bg-blue-400 dark:bg-blue-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                                <div className="w-2 h-2 bg-blue-400 dark:bg-blue-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                                <div className="w-2 h-2 bg-blue-400 dark:bg-blue-500 rounded-full animate-bounce"></div>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Input Area with improved design */}
                <div className="p-4 bg-white dark:bg-gray-800">
                  <div className="max-w-3xl mx-auto">
                    <div className="relative">
                      <div className="input-expand-container transition-all duration-200 ease-out">
                        <div className="bg-white dark:bg-gray-700 rounded-xl border border-gray-200 dark:border-gray-600 shadow-sm overflow-hidden">
                          {/* Text Input */}
                          <div className="p-3 px-4">
                            <textarea
                              ref={inputRef}
                              value={input}
                              onChange={(e) => {
                                setInput(e.target.value);
                                setTimeout(resizeTextarea, 0);
                              }}
                              onKeyDown={handleKeyPress}
                              placeholder="Ask a question about your meetings..."
                              className="w-full text-[15px] bg-transparent border-0 focus:ring-0 dark:text-gray-100 resize-none p-0 overflow-hidden"
                              style={{
                                height: "44px",
                                minHeight: "44px",
                                maxHeight: "200px",
                              }}
                              rows={1}
                              disabled={isLoading}
                            />
                          </div>

                          {/* Controls with improved styling */}
                          <div className="flex items-center justify-between px-3 py-2 border-t border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-800/70">
                            {/* Meeting Selector with enhanced visual feedback */}
                            <button
                              onClick={() => setIsMeetingSelectorOpen(true)}
                              className={`group px-2.5 py-1.5 rounded-lg transition-colors relative flex items-center gap-1.5 ${
                                selectedMeetings.length > 0
                                  ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/30"
                                  : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                              }`}
                              title={
                                selectedMeetings.length
                                  ? `${selectedMeetings.length} meetings selected`
                                  : "Select meetings"
                              }
                            >
                              <div className="relative">
                                {selectedMeetings.length > 0 ? (
                                  <Filter className="w-4 h-4" />
                                ) : (
                                  <PlusCircle className="w-4 h-4" />
                                )}
                                {selectedMeetings.length > 0 && (
                                  <span className="absolute -right-1.5 -top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-blue-500 text-[10px] font-medium text-white ring-1 ring-white dark:ring-gray-800">
                                    {selectedMeetings.length}
                                  </span>
                                )}
                              </div>
                              <span className="text-xs font-medium">
                                {selectedMeetings.length
                                  ? selectedMeetings.length > 1
                                    ? `${selectedMeetings.length} meetings`
                                    : "1 meeting"
                                  : "Select meetings"}
                              </span>
                            </button>

                            {/* Send Button with enhanced visual feedback */}
                            <button
                              onClick={sendMessage}
                              disabled={
                                isLoading ||
                                !input.trim() ||
                                selectedMeetings.length === 0
                              }
                              className={`p-2 rounded-lg transition-all ${
                                isLoading ||
                                !input.trim() ||
                                selectedMeetings.length === 0
                                  ? "text-gray-400 dark:text-gray-600 cursor-not-allowed"
                                  : "text-white bg-blue-500 hover:bg-blue-600 active:bg-blue-700 shadow-sm"
                              }`}
                              aria-label="Send message"
                            >
                              {isLoading ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                              ) : (
                                <Send className="w-4 h-4" />
                              )}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Warning Message with improved design */}
                    <AnimatePresence>
                      {!selectedMeetings.length && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="mt-2 text-xs bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 flex items-center gap-2 px-3 py-2 rounded-lg border border-amber-100 dark:border-amber-900/30"
                        >
                          <svg
                            className="w-4 h-4 flex-shrink-0"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                            />
                          </svg>
                          <span>
                            Select at least one meeting to search through your
                            transcripts
                          </span>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                <MeetingSelectorModal
                  isOpen={isMeetingSelectorOpen}
                  onClose={() => setIsMeetingSelectorOpen(false)}
                  selectedMeetings={selectedMeetings}
                  onSelectMeetings={handleMeetingSelection}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
