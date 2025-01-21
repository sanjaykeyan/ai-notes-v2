import { useState } from "react";
import Bookmarks from "./Bookmarks";

interface ScreenAProps {
  meetingId: string;
}

export default function ScreenA({ meetingId }: ScreenAProps) {
  const [activeTab, setActiveTab] = useState<"smart-filters" | "bookmarks">(
    "smart-filters"
  );

  return (
    <div className="bg-white/70 backdrop-blur-sm shadow-xl h-full flex flex-col">
      <div className="p-4 border-b shrink-0">
        <div className="flex space-x-4">
          <button
            onClick={() => setActiveTab("smart-filters")}
            className={`px-3 py-1.5 text-sm rounded-md ${
              activeTab === "smart-filters"
                ? "bg-gray-100 text-gray-900"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            SmartFilters
          </button>
          <button
            onClick={() => setActiveTab("bookmarks")}
            className={`px-3 py-1.5 text-sm rounded-md ${
              activeTab === "bookmarks"
                ? "bg-gray-100 text-gray-900"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Bookmarks
          </button>
        </div>
      </div>
      <div className="relative flex-1 overflow-hidden">
        <div className="absolute inset-0 overflow-y-auto elegant-scrollbar">
          <div className="p-4">
            {activeTab === "smart-filters" ? (
              <div>{/* SmartFilters content */}</div>
            ) : (
              <Bookmarks meetingId={meetingId} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
