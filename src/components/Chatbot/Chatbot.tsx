"use client";
import { useState, useRef, useEffect } from 'react';
import { PaperAirplaneIcon } from '@heroicons/react/24/outline'; // Remove XMarkIcon import
import Image from 'next/image';
import { useChat } from '@/contexts/ChatContext';

interface ChatbotProps {
  transcript: string;
  summary: string;
}

interface Message {
  text: string;
  sender: 'user' | 'bot';
}

const Chatbot = ({ transcript, summary }: ChatbotProps) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      text: "Hello! I'm here to help answer any questions you have about the meeting. Feel free to ask!",
      sender: "bot"
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toggleChat } = useChat();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || isLoading) return;

    const userMessage = { text: inputText, sender: 'user' as const };
    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: inputText,
          transcript,
          summary,
          messageHistory: messages, // Add message history to the request
        }),
      });

      if (!response.ok) throw new Error('Failed to get response');

      const data = await response.json();
      const botResponse = {
        text: data.response,
        sender: 'bot' as const
      };
      
      setMessages(prev => [...prev, botResponse]);
    } catch (error) {
      const errorMessage = {
        text: "I'm sorry, I encountered an error processing your request.",
        sender: 'bot' as const
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-12.4rem)] bg-white dark:bg-gray-800/95 backdrop-blur-sm rounded-tl-xl shadow-lg border-l border-t border-gray-200 dark:border-gray-700">
      {/* Header - removed close button */}
      <div className="flex items-center px-4 py-3 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/90 rounded-tl-xl">
        <div>
          <h3 className="font-medium text-gray-900 dark:text-gray-100">Meeting Assistant</h3>
          <p className="text-xs text-gray-500 dark:text-gray-400">Ask me anything about the meeting</p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 scroll-smooth">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} items-end space-x-2`}
          >
            {msg.sender === 'bot' && (
              <div className="w-6 h-6 rounded-full bg-white dark:bg-gray-800 flex items-center justify-center flex-shrink-0 overflow-hidden">
                <Image
                  src="/Icon.png"
                  alt="AI Assistant"
                  width={24}
                  height={24}
                  className="h-full w-full object-contain"
                />
              </div>
            )}
            <div
              className={`
                max-w-[80%] rounded-2xl px-4 py-2 text-sm
                ${msg.sender === 'user' 
                  ? 'bg-indigo-600 text-white rounded-br-none'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-bl-none border border-gray-200 dark:border-gray-700'
                }
              `}
            >
              {msg.text}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex items-center space-x-2 animate-pulse">
            <div className="w-2 h-2 rounded-full bg-indigo-400"></div>
            <div className="w-2 h-2 rounded-full bg-indigo-400 animation-delay-150"></div>
            <div className="w-2 h-2 rounded-full bg-indigo-400 animation-delay-300"></div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSend} className="p-4 border-t dark:border-gray-700 bg-gray-50 dark:bg-gray-800/90">
        <div className="flex gap-2 items-center">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={isLoading ? "Please wait..." : "Type your message..."}
            disabled={isLoading}
            className="flex-1 px-4 py-2.5 rounded-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-600 focus:border-transparent disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={isLoading}
            className="p-2.5 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-800 disabled:opacity-50"
          >
            <PaperAirplaneIcon className="w-5 h-5" />
          </button>
        </div>
      </form>
    </div>
  );
};

export default Chatbot;