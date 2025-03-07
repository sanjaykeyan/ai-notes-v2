"use client";

import { useState } from "react";
import CreateFolderModal from "@/components/CreateFolderModal";
import ScreenRecorder from "@/components/ScreenRecorder";

export default function MeetingsPageClient({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isCreateFolderModalOpen, setIsCreateFolderModalOpen] = useState(false);
  const [isScreenRecorderOpen, setIsScreenRecorderOpen] = useState(false);

  const handleRecordingComplete = (audioBlob: Blob, duration: number) => {
    console.log("Recording completed:", { audioBlob, duration });
    setIsScreenRecorderOpen(false);
  };

  return (
    <>
      {children}
      <CreateFolderModal
        isOpen={isCreateFolderModalOpen}
        onClose={() => setIsCreateFolderModalOpen(false)}
      />

      {/* Screen Recorder Modal */}
      {isScreenRecorderOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl w-full max-w-2xl p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                Record Meeting
              </h2>
              <button
                onClick={() => setIsScreenRecorderOpen(false)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <ScreenRecorder onRecordingComplete={handleRecordingComplete} />
          </div>
        </div>
      )}
    </>
  );
}
