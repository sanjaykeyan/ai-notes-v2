import { useState } from "react";
import { formatTranscript } from "../utils/transcriptFormatter";
import { MagnifyingGlassIcon, BookmarkIcon } from "@heroicons/react/24/outline";
import toast from "react-hot-toast";

interface ScreenCProps {
  transcript: string;
  meetingId: string;
}

export default function ScreenC({ transcript, meetingId }: ScreenCProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [isCreatingBookmark, setIsCreatingBookmark] = useState(false);
  const formattedTranscript = formatTranscript(transcript, searchTerm);

  const handleTextSelection = async () => {
    const selection = window.getSelection();
    if (!selection || selection.isCollapsed) return;

    const selectedText = selection.toString().trim();
    if (!selectedText) return;

    try {
      setIsCreatingBookmark(true);

      const response = await fetch("/api/bookmarks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // Add CSRF token if you have one
        },
        body: JSON.stringify({
          text: selectedText,
          meetingId: meetingId,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to create bookmark");
      }

      toast.success("Bookmark created successfully", {
        duration: 2000,
        style: {
          background: "#F9FAFB",
          color: "#1F2937",
          border: "1px solid #E5E7EB",
        },
      });
    } catch (error) {
      console.error("Error creating bookmark:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to create bookmark"
      );
    } finally {
      setIsCreatingBookmark(false);
    }
  };

  // Add loading indicator when creating bookmark
  const LoadingOverlay = isCreatingBookmark && (
    <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-50">
      <div className="bg-white p-4 rounded-lg shadow-lg">
        Creating bookmark...
      </div>
    </div>
  );

  return (
    <div className="bg-white shadow-sm border border-gray-200 h-full flex flex-col">
      {LoadingOverlay}
      <div className="p-4 border-b border-gray-200 shrink-0">
        <div className="flex items-center justify-between">
          <h2 className="text-lg heading-text">Full Transcript</h2>
          <div className="relative w-64">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MagnifyingGlassIcon className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
      </div>
      <div className="relative flex-1 overflow-hidden">
        <div className="absolute inset-0 overflow-y-auto elegant-scrollbar">
          <div className="p-6">
            <div className="space-y-1" onMouseUp={handleTextSelection}>
              {formattedTranscript}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
