"use client";

import Link from "next/link";
import { VideoIcon } from "lucide-react";
import DeleteMeetingButton from "@/components/DeleteMeetingButton";

interface Meeting {
  id: string;
  title: string;
  createdAt: Date;
  duration: number;
}

interface MyRecordsSectionProps {
  meetings: Meeting[];
}

export default function MyRecordsSection({ meetings }: MyRecordsSectionProps) {
  return (
    <div className="flex-1 px-6 overflow-hidden flex flex-col min-h-0">
      <h2
        className="text-sm font-medium mb-4 text-gray-900 dark:text-gray-100 flex-shrink-0"
        style={{
          fontFamily:
            '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
          fontSize: "14px",
        }}
      >
        My Records
      </h2>

      {/* Tabs */}
      <div className="flex gap-4 mb-4">{/* ...existing tabs code... */}</div>

      {/* Filters and List Container */}
      <div className="flex-1 overflow-auto elegant-scrollbar">
        {/* Column Headers */}
        <div className="flex items-center px-4 pb-2 text-xs text-gray-600 border-b border-gray-200 dark:border-gray-700">
          <div className="w-[60%] flex items-center">
            <button className="border border-gray-200 rounded-md px-3 py-1 flex items-center gap-1">
              All Types
              <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none">
                <path
                  d="M6 9L12 15L18 9"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
          <div className="w-[20%]">Duration</div>
          <div className="w-[20%] flex items-center gap-1">
            Date created
            <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none">
              <path
                d="M6 9L12 15L18 9"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>

        {/* List Items */}
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {meetings.length > 0 ? (
            meetings.map((meeting) => (
              <div
                key={meeting.id}
                className="flex items-center px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700/50"
              >
                <div className="flex items-center gap-3 w-[60%]">
                  <VideoIcon className="w-5 h-5 text-blue-500 flex-shrink-0" />
                  <Link
                    href={`/meetings/${meeting.id}`}
                    className="text-sm text-gray-900 dark:text-gray-100 truncate hover:text-blue-500 hover:underline"
                    style={{
                      fontFamily:
                        '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                      fontSize: "14px",
                    }}
                  >
                    {meeting.title || "Untitled Meeting"}
                  </Link>
                </div>
                <div className="w-[20%] text-xs text-gray-500 dark:text-gray-400">
                  {`${Math.floor(meeting.duration / 60)}min ${
                    meeting.duration % 60
                  }s`}
                </div>
                <div className="w-[20%] text-xs text-gray-500 dark:text-gray-400">
                  {new Date(meeting.createdAt).toLocaleDateString()}
                </div>
                <DeleteMeetingButton id={meeting.id} />
              </div>
            ))
          ) : (
            <div className="p-4 text-center text-xs text-gray-500">
              No meetings found
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
