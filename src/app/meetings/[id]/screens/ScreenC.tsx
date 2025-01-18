import { useState } from "react";
import { formatTranscript } from "../utils/transcriptFormatter";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";

interface ScreenCProps {
  transcript: string;
}

export default function ScreenC({ transcript }: ScreenCProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const formattedTranscript = formatTranscript(transcript, searchTerm);

  return (
    <div className="bg-white shadow-sm border border-gray-200 h-full flex flex-col">
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
            <div className="space-y-1">{formattedTranscript}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
