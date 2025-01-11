"use client";

import { useState } from "react";
import UploadMeetingModal from "./upload-meeting-modal";
import UploadTranscriptModal from "./upload-transcript-modal";

interface UploadButtonProps {
  type: "meeting" | "transcript";
  isNewUser?: boolean;
}

export default function UploadButton({ type, isNewUser }: UploadButtonProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const buttonConfig = {
    meeting: {
      gradient: "from-blue-600 to-purple-600",
      text: isNewUser ? "Upload Your First Meeting" : "Upload Recording",
      icon: (
        <svg
          className="w-6 h-6 group-hover:animate-bounce"
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
    },
    transcript: {
      gradient: "from-purple-600 to-blue-600",
      text: "Upload Transcript",
      icon: (
        <svg
          className="w-6 h-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
      ),
    },
  };

  const config = buttonConfig[type];

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className={`group relative ${
          isNewUser
            ? `bg-gradient-to-r ${config.gradient} text-white px-10 py-4`
            : "bg-gray-50 text-gray-600 px-4 py-2"
        } rounded-xl font-medium hover:shadow-xl hover:scale-105 transition-all duration-300
        flex items-center gap-3`}
      >
        {config.icon}
        {config.text}
      </button>
      {type === "meeting" ? (
        <UploadMeetingModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      ) : (
        <UploadTranscriptModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </>
  );
}
