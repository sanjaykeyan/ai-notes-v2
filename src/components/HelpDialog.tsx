"use client";

import { useState, useRef, useEffect } from "react";

export default function HelpDialog() {
  const [isOpen, setIsOpen] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dialogRef.current &&
        !dialogRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="fixed bottom-6 right-6 z-50" ref={dialogRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="group relative bg-gradient-to-r from-blue-600 to-purple-600 h-12 w-12 rounded-full shadow-lg flex items-center justify-center hover:scale-110 transition-all duration-200 animate-bounce-slow"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full blur-sm opacity-50 group-hover:opacity-75 transition-opacity" />
        <svg
          className="w-6 h-6 text-white relative z-10"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute bottom-[4.5rem] right-0 w-[320px] bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700">
          <div className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
              How it works
            </h2>
            <div className="space-y-4">
              {[
                {
                  title: "Upload Recording",
                  description:
                    "Upload your meeting recording in MP3 or MP4 format",
                  icon: "📤",
                },
                {
                  title: "AI Processing",
                  description: "Our AI transcribes and summarizes your meeting",
                  icon: "🤖",
                },
                {
                  title: "Review & Share",
                  description:
                    "Get your meeting notes and share with your team",
                  icon: "✨",
                },
              ].map((item) => (
                <div key={item.title} className="flex items-start gap-3">
                  <span className="text-xl">{item.icon}</span>
                  <div>
                    <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      {item.title}
                    </h3>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
