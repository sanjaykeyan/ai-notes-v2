"use client";
import { useState } from "react";
import { MagnifyingGlassIcon, BookmarkIcon } from "@heroicons/react/24/outline";
import Bookmarks from "./Bookmarks";
import SmartFilters from "./SmartFilters";

interface ScreenAProps {
  meetingId: string;
  onBookmarksChange?: () => void;
}

export default function ScreenA({
  meetingId,
  onBookmarksChange,
}: ScreenAProps) {
  const [selectedView, setSelectedView] = useState<"search" | "bookmarks">(
    "search"
  );

  return (
    <div className="h-full flex">
      {" "}
      {/* Adjusted height to account for header (72px) + audio player (~128px) */}
      {/* Sidebar */}
      <div className="h-full w-[60px] border-r border-gray-200 bg-white flex-shrink-0">
        <nav className="p-2 space-y-2">
          <button
            onClick={() => setSelectedView("search")}
            className={`w-full p-3 rounded-md ${
              selectedView === "search" ? "bg-gray-100" : ""
            }`}
          >
            <MagnifyingGlassIcon className="h-5 w-5" />
          </button>
          <button
            onClick={() => setSelectedView("bookmarks")}
            className={`w-full p-3 rounded-md ${
              selectedView === "bookmarks" ? "bg-gray-100" : ""
            }`}
          >
            <BookmarkIcon className="h-5 w-5" />
          </button>
        </nav>
      </div>
      {/* Content */}
      <div className="flex-1 bg-white/70 backdrop-blur-sm shadow-xl flex flex-col min-w-0">
        <div className="flex-shrink-0 px-4 py-3 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            {selectedView === "bookmarks" ? "Bookmarks" : "Smart Filters"}
          </h2>
        </div>
        <div className="flex-1 overflow-y-auto elegant-scrollbar">
          <div className="h-full p-4">
            {selectedView === "bookmarks" ? (
              <Bookmarks
                meetingId={meetingId}
                onBookmarksChange={onBookmarksChange}
              />
            ) : (
              <SmartFilters meetingId={meetingId} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
