"use client";

import { useState, useEffect, useRef } from "react";
import DashboardSidebar from "@/components/DashboardSidebar";
import DashboardTopbar from "@/components/DashboardTopbar";
import { Send, Filter, Loader2, MessageSquare, PlusCircle } from "lucide-react";
import MeetingSelectorModal from "@/components/MeetingSelectorModal";
import { toast } from "react-hot-toast";
import { motion } from "framer-motion";

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

  // Auto-resize textarea
  const resizeTextarea = () => {
    const textarea = inputRef.current;
    if (textarea) {
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
    }
  };

  useEffect(() => {
    resizeTextarea();
  }, [input]);

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50 dark:bg-gray-900">
      <DashboardSidebar />

      <div
        className="flex-1 flex flex-col overflow-hidden"
        style={{ marginLeft: "calc(var(--sidebar-width) - 10px)" }}
      >
        <DashboardTopbar />

        <div className="flex-1 p-3 overflow-hidden">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 h-full overflow-hidden">
            <div className="flex h-full">
              {/* Left Pane - Chat History */}
              <div className="w-72 border-r border-gray-200 dark:border-gray-700 flex flex-col">
                <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                  <button
                    onClick={createNewChat}
                    className="w-full px-4 py-2.5 text-[14px] text-white bg-blue-600 rounded-lg hover:bg-blue-700 active:bg-blue-800 transition-colors flex items-center justify-center gap-2 font-medium shadow-sm"
                  >
                    <PlusCircle className="w-4 h-4" />
                    New Chat
                  </button>
                </div>
                <div className="flex-1 overflow-y-auto p-2 space-y-1.5">
                  {chats.length === 0 ? (
                    <div className="py-6 text-center text-gray-500 dark:text-gray-400 text-sm">
                      No chat history yet
                    </div>
                  ) : (
                    chats.map((chat) => (
                      <div
                        key={chat.id}
                        onClick={() => setSelectedChat(chat.id)}
                        className={`p-3 text-[14px] rounded-lg cursor-pointer border transition-all duration-200 group ${
                          selectedChat === chat.id
                            ? "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-900"
                            : "border-transparent hover:bg-gray-50 dark:hover:bg-gray-700/40"
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <MessageSquare
                            className={`w-4 h-4 ${
                              selectedChat === chat.id
                                ? "text-blue-500"
                                : "text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-300"
                            }`}
                          />
                          <span
                            className={`truncate ${
                              selectedChat === chat.id
                                ? "text-blue-700 dark:text-blue-300 font-medium"
                                : "text-gray-700 dark:text-gray-300"
                            }`}
                          >
                            {chat.title}
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Main Chat Area */}
              <div className="flex-1 flex flex-col">
                {/* Selected Meetings Display */}
                {selectedMeetingsInfo.length > 0 && (
                  <div className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/60 px-4 py-2 flex items-center">
                    <div className="text-xs text-gray-500 dark:text-gray-400 flex flex-wrap gap-1.5 items-center">
                      <span>Searching in:</span>
                      {selectedMeetingsInfo.map((meeting) => (
                        <span
                          key={meeting.id}
                          className="inline-flex items-center px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-xs"
                        >
                          {meeting.title}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Chat Messages */}
                <div
                  className="flex-1 overflow-y-auto overflow-x-hidden p-6" // Changed overflow handling
                  ref={chatContainerRef}
                >
                  <div className="max-w-3xl mx-auto relative">
                    {" "}
                    {/* Added relative */}
                    {messages.length === 0 ? (
                      <div className="h-full flex flex-col items-center justify-center text-center py-12">
                        <div className="w-20 h-20 mb-6 bg-blue-50 dark:bg-blue-900/20 rounded-full flex items-center justify-center shadow-sm">
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
                        <h3 className="text-[18px] font-semibold mb-3 text-gray-900 dark:text-gray-100">
                          Ask me anything about your meetings
                        </h3>
                        <p className="text-[15px] text-gray-500 dark:text-gray-400 max-w-md leading-relaxed">
                          Search across all your meeting transcripts and get
                          instant answers to your questions.
                        </p>
                        <div className="mt-6 flex flex-col gap-3 items-center">
                          <button
                            onClick={() => setIsMeetingSelectorOpen(true)}
                            className="px-4 py-2.5 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors flex items-center gap-2.5 text-sm font-medium shadow-sm border border-blue-100 dark:border-blue-800"
                          >
                            <Filter className="w-4 h-4" />
                            Select meetings to search
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-6 w-full">
                        {" "}
                        {/* Added w-full */}
                        {messages.map((message, index) => (
                          <motion.div
                            key={message.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: index * 0.1 }}
                            className={`flex ${
                              message.role === "user"
                                ? "justify-end"
                                : "justify-start"
                            }`}
                          >
                            <div
                              className={`max-w-[80%] min-w-0 rounded-2xl p-4 ${
                                // Added min-w-0
                                message.role === "user"
                                  ? "bg-blue-500 text-white shadow-sm"
                                  : "bg-gray-100 dark:bg-gray-700/70 text-gray-800 dark:text-gray-100 shadow-sm"
                              }`}
                            >
                              <p className="text-[15px] whitespace-pre-wrap leading-relaxed break-words">
                                {" "}
                                {/* Added break-words */}
                                {message.content}
                              </p>
                              <div
                                className={`text-[11px] mt-1 text-right ${
                                  message.role === "user"
                                    ? "text-blue-200"
                                    : "text-gray-400 dark:text-gray-500"
                                }`}
                              >
                                {new Date(message.createdAt).toLocaleTimeString(
                                  [],
                                  {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  }
                                )}
                              </div>
                            </div>
                          </motion.div>
                        ))}
                        <div ref={messagesEndRef} />
                        {isLoading && (
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="flex justify-start"
                          >
                            <div className="bg-gray-100 dark:bg-gray-700/70 rounded-2xl p-4 flex items-center">
                              <div className="flex space-x-1.5">
                                <div className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                                <div className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                                <div className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce"></div>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Input Area */}
                <div className="p-4">
                  <div className="max-w-3xl mx-auto">
                    <div className="relative">
                      <div className="input-expand-container transition-all duration-200 ease-out">
                        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
                          {/* Text Input */}
                          <div className="p-3">
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

                          {/* Controls */}
                          <div className="flex items-center justify-between px-3 py-2 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/70">
                            {/* Meeting Selector */}
                            <button
                              onClick={() => setIsMeetingSelectorOpen(true)}
                              className="group p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors relative"
                              title={
                                selectedMeetings.length
                                  ? `${selectedMeetings.length} meetings selected`
                                  : "Select meetings"
                              }
                            >
                              <div className="relative">
                                <PlusCircle
                                  className={`w-5 h-5 ${
                                    selectedMeetings.length > 0
                                      ? "text-blue-500 dark:text-blue-400"
                                      : "text-gray-500 dark:text-gray-400"
                                  }`}
                                />
                                {selectedMeetings.length > 0 && (
                                  <span className="absolute -right-1.5 -top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-blue-500 text-[10px] font-medium text-white ring-1 ring-white dark:ring-gray-800">
                                    {selectedMeetings.length}
                                  </span>
                                )}
                              </div>
                            </button>

                            {/* Send Button */}
                            <button
                              onClick={sendMessage}
                              disabled={
                                isLoading ||
                                !input.trim() ||
                                selectedMeetings.length === 0
                              }
                              className={`p-2 rounded-lg transition-colors ${
                                isLoading ||
                                !input.trim() ||
                                selectedMeetings.length === 0
                                  ? "text-gray-400 dark:text-gray-600 cursor-not-allowed"
                                  : "text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                              }`}
                              aria-label="Send message"
                            >
                              {isLoading ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                              ) : (
                                <svg
                                  className="w-5 h-5 transform rotate-90"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                                  />
                                </svg>
                              )}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Warning Message */}
                    {!selectedMeetings.length && (
                      <div className="mt-2 text-xs text-amber-600 dark:text-amber-400 flex items-center gap-1.5 px-1">
                        <svg
                          className="w-3.5 h-3.5"
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
                        Please select at least one meeting to search through
                      </div>
                    )}
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
