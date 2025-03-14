"use client";

import { useState } from "react";
import { VideoIcon, Pencil } from "lucide-react";
import Link from "next/link";
import DeleteMeetingButton from "@/components/DeleteMeetingButton";
import MoveMeetingsDialog from "./MoveMeetingsDialog";

interface Meeting {
  id: string;
  title: string;
  createdAt: Date;
  duration: number | null;
  folderId: string | null;
  isLiveRecorded?: boolean;
}

interface RecordsProps {
  meetings: Meeting[];
  onDelete: (id: string) => void;
  folders: { id: string; name: string }[];
  onMoveMeetings: (meetingIds: string[], targetFolderId: string | null) => void;
  onRename?: (id: string, newTitle: string) => Promise<void>;
}

type SortField = "name" | "duration" | "date";
type SortDirection = "asc" | "desc";

export default function Records({
  meetings,
  onDelete,
  folders,
  onMoveMeetings,
  onRename,
}: RecordsProps) {
  const [selectedMeetings, setSelectedMeetings] = useState<string[]>([]);
  const [isMovingDialogOpen, setIsMovingDialogOpen] = useState(false);
  const [editingMeetingId, setEditingMeetingId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState("");
  const [sortConfig, setSortConfig] = useState<{
    field: SortField;
    direction: SortDirection;
  }>({
    field: "date",
    direction: "desc",
  });

  const handleDragStart = (e: React.DragEvent, meetingId: string) => {
    e.dataTransfer.setData("meetingId", meetingId);
  };

  const handleMoveToFolder = (folderId: string | null) => {
    onMoveMeetings(selectedMeetings, folderId);
    setSelectedMeetings([]);
    setIsMovingDialogOpen(false);
  };

  const handleStartRename = (meeting: Meeting, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation(); // Prevent any parent click handlers
    setEditingMeetingId(meeting.id);
    setEditingTitle(meeting.title || "Untitled Meeting");
  };

  const handleRename = async (meetingId: string) => {
    if (!onRename || editingTitle.trim() === "") return;

    try {
      await onRename(meetingId, editingTitle);
    } catch (error) {
      console.error("Failed to rename meeting:", error);
    } finally {
      setEditingMeetingId(null);
      setEditingTitle("");
    }
  };

  const handleRenameKeyDown = (e: React.KeyboardEvent, meetingId: string) => {
    if (e.key === "Enter") {
      handleRename(meetingId);
    } else if (e.key === "Escape") {
      setEditingMeetingId(null);
      setEditingTitle("");
    }
  };

  const handleSort = (field: SortField) => {
    setSortConfig((current) => ({
      field,
      direction:
        current.field === field && current.direction === "asc" ? "desc" : "asc",
    }));
  };

  const getSortedMeetings = () => {
    return [...meetings].sort((a, b) => {
      const multiplier = sortConfig.direction === "asc" ? 1 : -1;

      switch (sortConfig.field) {
        case "name":
          return (a.title || "").localeCompare(b.title || "") * multiplier;
        case "duration":
          const durationA = a.duration || 0;
          const durationB = b.duration || 0;
          return (durationA - durationB) * multiplier;
        case "date":
          return (
            (new Date(a.createdAt).getTime() -
              new Date(b.createdAt).getTime()) *
            multiplier
          );
        default:
          return 0;
      }
    });
  };

  const SortIcon = ({ field }: { field: SortField }) => (
    <svg
      className={`w-3 h-3 transition-transform ${
        sortConfig.field === field
          ? "text-blue-500" +
            (sortConfig.direction === "desc" ? " rotate-180" : "")
          : "text-gray-400"
      }`}
      viewBox="0 0 24 24"
      fill="none"
    >
      <path
        d="M6 9L12 15L18 9"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );

  return (
    <div className="flex-1 px-6 overflow-hidden flex flex-col min-h-0">
      {/* Action bar when meetings are selected */}
      {selectedMeetings.length > 0 && (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-100 dark:border-blue-800 p-3 rounded-lg mb-4 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-2">
            <div className="bg-blue-600 text-white text-xs font-medium px-2 py-1 rounded">
              {selectedMeetings.length} selected
            </div>
            <span className="text-sm text-gray-600 dark:text-gray-300">
              Items selected
            </span>
          </div>
          <button
            onClick={() => setIsMovingDialogOpen(true)}
            className="flex items-center gap-2 text-sm bg-blue-600 text-white px-4 py-1.5 rounded-lg hover:bg-blue-700 transition-colors duration-200 shadow-sm"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-4 h-4"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3.75 9.776c.112-.017.227-.026.344-.026h15.812c.117 0 .232.009.344.026m-16.5 0a2.25 2.25 0 00-1.883 2.542l.857 6a2.25 2.25 0 002.227 1.932H19.05a2.25 2.25 0 002.227-1.932l.857-6a2.25 2.25 0 00-1.883-2.542m-16.5 0V6A2.25 2.25 0 016 3.75h3.879a1.5 1.5 0 011.06.44l2.122 2.12a1.5 1.5 0 001.06.44H18A2.25 2.25 0 0120.25 9v.776"
              />
            </svg>
            Move to Folder
          </button>
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-4 mb-4">{/* ...existing tabs code... */}</div>

      {/* Filters and List Container */}
      <div className="flex-1 overflow-auto elegant-scrollbar">
        {/* Column Headers */}
        <div className="flex items-center px-4 pb-2 text-xs text-gray-600 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700">
          <div className="w-[60%] flex items-center">
            <div
              className="ml-8 cursor-pointer flex items-center gap-1"
              onClick={() => handleSort("name")}
            >
              Meeting Name
              <SortIcon field="name" />
            </div>
          </div>
          <div
            className="w-[20%] -ml-1 cursor-pointer flex items-center gap-1"
            onClick={() => handleSort("duration")}
          >
            Duration
            <SortIcon field="duration" />
          </div>
          <div
            className="w-[20%] -ml-1 cursor-pointer flex items-center gap-1"
            onClick={() => handleSort("date")}
          >
            Date created
            <SortIcon field="date" />
          </div>
        </div>

        {/* List Items */}
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {getSortedMeetings().length > 0 ? (
            getSortedMeetings().map((meeting) => (
              <div
                key={meeting.id}
                draggable
                onDragStart={(e) => handleDragStart(e, meeting.id)}
                className="flex items-center px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 group"
              >
                {/* Checkbox section */}
                <div
                  className={`mr-3 transition-opacity ${
                    selectedMeetings.includes(meeting.id)
                      ? "opacity-100"
                      : "opacity-0 group-hover:opacity-100"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={selectedMeetings.includes(meeting.id)}
                    onChange={(e) => {
                      setSelectedMeetings((prev) =>
                        e.target.checked
                          ? [...prev, meeting.id]
                          : prev.filter((id) => id !== meeting.id)
                      );
                    }}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                </div>

                {/* Meeting title section */}
                <div className="flex items-center gap-3 w-[60%] relative">
                  <VideoIcon className="w-5 h-5 text-blue-500 flex-shrink-0" />
                  {editingMeetingId === meeting.id ? (
                    <div className="flex-1 relative max-w-md">
                      <input
                        type="text"
                        value={editingTitle}
                        onChange={(e) => setEditingTitle(e.target.value)}
                        onBlur={() => handleRename(meeting.id)}
                        onKeyDown={(e) => handleRenameKeyDown(e, meeting.id)}
                        className="w-full bg-white dark:bg-gray-800 border border-blue-500 dark:border-blue-400 rounded px-2 py-1 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                        autoFocus
                      />
                      <div className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-gray-400 whitespace-nowrap">
                        Press Enter to save
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center flex-1 group/title">
                      <Link
                        href={`/meetings/${meeting.id}`}
                        className="text-sm text-gray-900 dark:text-gray-100 truncate hover:text-blue-500 hover:underline mr-2"
                        style={{
                          fontFamily:
                            '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                          fontSize: "14px",
                        }}
                      >
                        {meeting.title || "Untitled Meeting"}
                      </Link>
                      <button
                        onClick={(e) => handleStartRename(meeting, e)}
                        className="opacity-0 group-hover/title:opacity-100 transition-opacity hover:bg-gray-100 dark:hover:bg-gray-700 p-1 rounded-md"
                        title="Rename meeting"
                      >
                        <Pencil className="w-3.5 h-3.5 text-gray-400 hover:text-blue-500" />
                      </button>
                    </div>
                  )}
                </div>

                {/* Duration and date sections remain unchanged */}
                <div className="w-[20%] text-xs text-gray-500 dark:text-gray-400">
                  {`${Math.floor(meeting.duration || 0 / 60)}min ${
                    meeting.duration || 0 % 60
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

      <MoveMeetingsDialog
        isOpen={isMovingDialogOpen}
        onClose={() => setIsMovingDialogOpen(false)}
        folders={folders}
        onMove={handleMoveToFolder}
      />
    </div>
  );
}
