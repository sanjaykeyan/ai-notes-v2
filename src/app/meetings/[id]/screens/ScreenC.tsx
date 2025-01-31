import { useState, useEffect, useRef } from "react";
import { formatTranscript } from "../utils/transcriptFormatter";
import { MagnifyingGlassIcon, BookmarkIcon } from "@heroicons/react/24/outline";
import toast from "react-hot-toast";
import { usePlayback } from '@/contexts/PlaybackContext';

interface ScreenCProps {
  transcript: string;
  meetingId: string;
  timestampMapping: Array<{ text: string; start_time: number }>;
  onBookmarkCreate?: () => void;
}

interface PopoverPosition {
  x: number;
  y: number;
}

export default function ScreenC({
  transcript,
  meetingId,
  timestampMapping = [], // Add default empty array
  onBookmarkCreate,
}: ScreenCProps) {
  const { currentTime, seekTo } = usePlayback();
  const [searchTerm, setSearchTerm] = useState("");
  const [isCreatingBookmark, setIsCreatingBookmark] = useState(false);
  const [showPopover, setShowPopover] = useState(false);
  const [popoverPosition, setPopoverPosition] = useState<PopoverPosition>({
    x: 0,
    y: 0,
  });
  const [selectedText, setSelectedText] = useState("");
  const [customNames, setCustomNames] = useState<Record<string, string>>({});
  const popoverRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    console.log("ScreenC received:", {
      hasTranscript: Boolean(transcript),
      transcriptLength: transcript?.length,
      hasTimestampMapping: Boolean(timestampMapping),
      timestampMappingLength: timestampMapping?.length,
      timestampMappingSample: timestampMapping?.slice(0, 2)
    });
  }, [transcript, timestampMapping]);

  useEffect(() => {
    // More detailed logging
    console.log("ScreenC received transcript:", {
      transcript: transcript,
      type: typeof transcript,
      isArray: Array.isArray(transcript)
    });
    
    console.log("ScreenC timestampMapping sample:", {
      first: timestampMapping?.[0],
      textType: timestampMapping?.[0]?.text ? typeof timestampMapping[0].text : 'undefined'
    });
  }, [transcript, timestampMapping]);

  const handleSpeakerUpdate = async (
    originalName: string,
    customName: string
  ) => {
    try {
      if (!meetingId || !originalName || !customName) {
        throw new Error("Missing required fields");
      }

      const response = await fetch(`/api/meetings/${meetingId}/speakers`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          // Add cache control to prevent caching
          "Cache-Control": "no-cache",
        },
        body: JSON.stringify({
          originalName: originalName.trim(),
          customName: customName.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to update speaker");
      }

      setCustomNames((prev) => ({
        ...prev,
        [originalName]: customName,
      }));

      toast.success("Speaker name updated");
    } catch (error) {
      console.error("Error updating speaker:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to update speaker name"
      );
    }
  };

  // Load custom names when component mounts
  interface SpeakerMapping {
    originalName: string;
    customName: string;
  }

  useEffect(() => {
    const loadCustomNames = async () => {
      try {
        const response = await fetch(`/api/meetings/${meetingId}/speakers`);
        if (response.ok) {
          const mappings = await response.json();
          const names = mappings.reduce(
            (acc: Record<string, string>, mapping: SpeakerMapping) => {
              acc[mapping.originalName] = mapping.customName;
              return acc;
            },
            {}
          );
          setCustomNames(names);
        }
      } catch (error) {
        console.error("Error loading speaker mappings:", error);
      }
    };
    loadCustomNames();
  }, [meetingId]);

  const formattedTranscript = formatTranscript(
    transcript,
    searchTerm,
    meetingId,
    customNames,
    handleSpeakerUpdate
  );

  // Close popover when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(event.target as Node)
      ) {
        setShowPopover(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleTextSelection = () => {
    const selection = window.getSelection();
    if (!selection || selection.isCollapsed) {
      setShowPopover(false);
      return;
    }

    const text = selection.toString().trim();
    if (!text) {
      setShowPopover(false);
      return;
    }

    setSelectedText(text);

    // Get selection coordinates
    const range = selection.getRangeAt(0);
    const rect = range.getBoundingClientRect();

    setPopoverPosition({
      x: rect.left + rect.width / 2,
      y: rect.top - 10,
    });

    setShowPopover(true);
  };

  const createBookmark = async () => {
    try {
      setIsCreatingBookmark(true);
      setShowPopover(false);

      const response = await fetch("/api/bookmarks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: selectedText,
          meetingId: meetingId,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create bookmark");
      }

      // Dispatch custom event after successful bookmark creation
      window.dispatchEvent(new Event("bookmarkUpdated"));

      if (onBookmarkCreate) {
        onBookmarkCreate();
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
      toast.error("Failed to create bookmark");
    } finally {
      setIsCreatingBookmark(false);
    }
  };

  const getCurrentSegment = () => {
    if (!timestampMapping || timestampMapping.length === 0) return null;
    
    const currentTimeMs = currentTime * 1000;
    console.log("Current time (ms):", currentTimeMs);
    
    const currentIndex = timestampMapping.findIndex((segment, index) => {
      const nextSegment = timestampMapping[index + 1];
      return segment.start_time <= currentTimeMs && 
             (!nextSegment || nextSegment.start_time > currentTimeMs);
    });
    
    return currentIndex >= 0 ? currentIndex : null;
  };

  const handleSegmentClick = (startTime: number) => {
    // Convert milliseconds to seconds for the audio player
    seekTo(startTime / 1000);
  };

  const renderTranscriptContent = () => {
    if (!timestampMapping?.length) {
      return formattedTranscript;
    }
  
    return (
      <div className="space-y-1">
        {timestampMapping.map((segment, index) => {
          const formattedText = formatTranscript(
            segment.text,
            searchTerm,
            meetingId,
            customNames,
            handleSpeakerUpdate,
            segment.start_time // Pass the timestamp to the formatter
          );

          return (
            <div 
              key={`segment-${index}`}
              onClick={() => handleSegmentClick(segment.start_time)}
              className={`py-2 px-4 rounded transition-colors cursor-pointer hover:bg-gray-50 ${
                index === getCurrentSegment()
                  ? 'bg-blue-50 border-l-4 border-blue-500'
                  : ''
              }`}
            >
              {formattedText}
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="bg-white shadow-sm border border-gray-200 h-full flex flex-col">
      {isCreatingBookmark && (
        <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded-lg shadow-lg">
            Creating bookmark...
          </div>
        </div>
      )}

      {showPopover && (
        <button
          ref={popoverRef}
          onClick={createBookmark}
          style={{
            position: "fixed",
            left: `${popoverPosition.x}px`,
            top: `${popoverPosition.y}px`,
            transform: "translate(-50%, -100%)",
          }}
          className="p-2 bg-white rounded-full shadow-lg border border-gray-200 hover:bg-gray-50 transition-colors z-50"
        >
          <BookmarkIcon className="h-4 w-4 text-gray-600" />
        </button>
      )}

      <div className="px-4 py-3 border-b border-gray-200 flex justify-between items-center lg:flex hidden">
        <h2 className="text-lg font-semibold text-gray-900">Transcript</h2>
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
      
      {/* Add a mobile-only search bar */}
      <div className="lg:hidden px-4 py-2 border-b border-gray-200">
        <div className="relative w-full">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <MagnifyingGlassIcon className="h-4 w-4 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search transcript..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      <div className="relative flex-1 overflow-hidden">
        <div className="absolute inset-0 overflow-y-auto elegant-scrollbar">
          <div className="p-6">
            <div className="space-y-1" onMouseUp={handleTextSelection}>
              {renderTranscriptContent()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
