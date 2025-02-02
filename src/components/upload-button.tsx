"use client";

import { useState } from "react";
import UploadMeetingModal from "./upload-meeting-modal";

export default function UploadButton() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const buttonStyle = {
    gradient: isProcessing
      ? "from-gray-400 to-gray-500"
      : "from-blue-600 to-purple-600",
    text: isProcessing ? "Processing..." : "Upload Recording",
    icon: (
      <svg
        className={`w-6 h-6 ${isProcessing ? "" : "group-hover:animate-bounce"}`}
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
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        disabled={isProcessing}
        className={`group flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-white bg-gradient-to-r ${buttonStyle.gradient} transition-all duration-300 hover:shadow-lg disabled:cursor-not-allowed`}
      >
        {buttonStyle.icon}
        {buttonStyle.text}
      </button>

      <UploadMeetingModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        onProcessingStart={() => setIsProcessing(true)}
        onProcessingEnd={() => setIsProcessing(false)}
      />
    </>
  );
}
