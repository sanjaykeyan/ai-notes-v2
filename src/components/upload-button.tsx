"use client";

import { useState } from "react";
import UploadMeetingModal from "./upload-meeting-modal";

export default function UploadButton({
  variant = "default",
}: {
  variant?: "default" | "icon";
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const buttonStyle = {
    gradient: isProcessing
      ? "bg-gray-400 dark:bg-gray-600"
      : "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 dark:from-blue-600 dark:to-purple-600 dark:hover:from-blue-500 dark:hover:to-purple-500",
    text: isProcessing ? "Processing..." : "Upload Recording",
    icon: (
      <svg
        className={`w-6 h-6 ${
          isProcessing ? "" : "group-hover:animate-bounce"
        }`}
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
        />
      </svg>
    ),
  };

  return (
    <div>
      <button
        onClick={() => setIsModalOpen(true)}
        disabled={isProcessing}
        className={`group relative flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-white ${
          buttonStyle.gradient
        } 
        transition-colors duration-200 hover:shadow-lg disabled:cursor-not-allowed 
        dark:shadow-lg dark:shadow-blue-500/20 dark:hover:shadow-blue-500/40
        ${variant === "icon" && "w-12 h-12 rounded-xl p-0"}`}
      >
        {variant === "default" ? (
          <>
            {buttonStyle.icon}
            <span>{buttonStyle.text}</span>
          </>
        ) : (
          buttonStyle.icon
        )}
      </button>

      <UploadMeetingModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onProcessingStart={() => setIsProcessing(true)}
        onProcessingEnd={() => setIsProcessing(false)}
      />
    </div>
  );
}
