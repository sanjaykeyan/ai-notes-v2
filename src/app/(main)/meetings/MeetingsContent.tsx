"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import {
  createFolder,
  deleteFolder,
  updateMeetingFolder,
} from "@/app/api/folders/actions/folder";
import FolderMenu from "@/components/FolderMenu";
import MyRecordsSection from "@/components/MyRecordsSection";
import Records from "@/components/RecordSection_MeetingPage";

type Meeting = {
  id: string;
  title: string;
  duration: number;
  createdAt: Date;
  folderId: string | null;
  isLiveRecorded?: boolean; // Add this field
};

type Folder = {
  id: string;
  name: string;
};

export default function MeetingsContent({
  meetings: initialMeetings,
  folders: initialFolders,
}: {
  meetings: Meeting[];
  folders: Folder[];
}) {
  const [folders, setFolders] = useState(initialFolders);
  const [meetings, setMeetings] = useState(initialMeetings);
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null);
  const [isCreatingFolder, setIsCreatingFolder] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");
  const newFolderInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isCreatingFolder) {
      newFolderInputRef.current?.focus();
    }
  }, [isCreatingFolder]);

  const handleCreateFolder = async () => {
    if (!newFolderName.trim()) {
      setIsCreatingFolder(false);
      return;
    }

    try {
      const newFolder = await createFolder(newFolderName);
      // Update the folders state with the new folder
      setFolders((prevFolders) => [...prevFolders, newFolder]);
      setNewFolderName("");
      setIsCreatingFolder(false);
    } catch (error) {
      console.error("Failed to create folder:", error);
    }
  };

  const handleDeleteFolder = useCallback(
    async (folderId: string) => {
      try {
        // Optimistic update
        setFolders(folders.filter((folder) => folder.id !== folderId));

        // If the deleted folder was selected, reset to root folder
        if (selectedFolderId === folderId) {
          setSelectedFolderId(null);
        }

        // Actually delete the folder
        await deleteFolder(folderId);
      } catch (error) {
        console.error("Error deleting folder:", error);
        // Rollback on error
        setFolders(initialFolders);
      }
    },
    [folders, initialFolders, selectedFolderId]
  );

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleCreateFolder();
    } else if (e.key === "Escape") {
      setIsCreatingFolder(false);
      setNewFolderName("");
    }
  };

  const displayedMeetings = meetings.filter((meeting) => {
    if (selectedFolderId === null) return true; // Show all meetings in root
    return meeting.folderId === selectedFolderId;
  });

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    if (mins === 0) {
      return `${secs}s`;
    }
    return `${mins}m ${secs}s`;
  };

  const getTotalDuration = (meetings: Meeting[]) => {
    const totalSeconds = meetings.reduce(
      (acc, meeting) => acc + meeting.duration,
      0
    );
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    if (mins === 0) {
      return `${secs} seconds`;
    }
    return secs > 0 ? `${mins} min ${secs} sec` : `${mins} min`;
  };

  const handleMeetingDelete = useCallback((meetingId: string) => {
    setMeetings((prevMeetings) =>
      prevMeetings.filter((meeting) => meeting.id !== meetingId)
    );
  }, []);

  const handleDrop = async (
    e: React.DragEvent,
    targetFolderId: string | null
  ) => {
    e.preventDefault();
    const meetingId = e.dataTransfer.getData("meetingId");

    try {
      await updateMeetingFolder(meetingId, targetFolderId);

      // Update local state
      setMeetings(
        meetings.map((meeting) =>
          meeting.id === meetingId
            ? { ...meeting, folderId: targetFolderId }
            : meeting
        )
      );
    } catch (error) {
      console.error("Failed to move meeting:", error);
    }
  };

  const handleMoveMeetings = async (
    meetingIds: string[],
    targetFolderId: string | null
  ) => {
    try {
      // Update all meetings in parallel
      await Promise.all(
        meetingIds.map((id) => updateMeetingFolder(id, targetFolderId))
      );

      // Update local state
      setMeetings(
        meetings.map((meeting) =>
          meetingIds.includes(meeting.id)
            ? { ...meeting, folderId: targetFolderId }
            : meeting
        )
      );
    } catch (error) {
      console.error("Failed to move meetings:", error);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  return (
    <div className="flex-1 p-1 pl-0 overflow-hidden">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 h-full">
        <div className="flex h-full overflow-hidden">
          {/* Left Sidebar */}
          <div className="w-72 border-r border-gray-200 dark:border-gray-700 h-full rounded-xl flex flex-col bg-white dark:bg-gray-800">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                Folders
              </h2>
              <button
                onClick={() => setIsCreatingFolder(true)}
                className="inline-flex items-center gap-1.5 px-2.5 py-1.5 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-lg shadow-sm hover:shadow transition-all duration-200 group"
              >
                <svg
                  className="w-4 h-4 text-blue-100 group-hover:scale-110 transition-transform duration-200"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 4.5v15m7.5-7.5h-15"
                  />
                </svg>
                <span className="font-medium text-sm">New</span>
              </button>
            </div>
            <div className="p-3 space-y-1 overflow-y-auto flex-1 relative scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-gray-100 dark:scrollbar-track-gray-800/50">
              {/* Root folder button */}
              <button
                onClick={() => setSelectedFolderId(null)}
                onDrop={(e) => handleDrop(e, null)}
                onDragOver={handleDragOver}
                className={`flex w-full items-center gap-2.5 px-3 py-2 rounded-lg transition-colors duration-200 ${
                  selectedFolderId === null
                    ? "text-blue-600 bg-blue-50 dark:bg-blue-900/20 dark:text-blue-400"
                    : "text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                }`}
              >
                <svg
                  className="w-5 h-5"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.93a2 2 0 0 1-1.66-.9l-.82-1.2A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13c0 1.1.9 2 2 2Z" />
                  <circle cx="12" cy="13" r="3" />
                  <path d="M12 10v6" />
                  <path d="M9 13h6" />
                </svg>
                <span className="text-sm font-medium">All Meetings</span>
              </button>

              {/* Folders list */}
              {folders.map((folder) => (
                <div
                  key={folder.id}
                  className="flex items-center justify-between group relative"
                >
                  <button
                    onClick={() => setSelectedFolderId(folder.id)}
                    onDrop={(e) => handleDrop(e, folder.id)}
                    onDragOver={handleDragOver}
                    className={`flex flex-1 items-center gap-2.5 px-3 py-2 rounded-lg group transition-colors duration-200 ${
                      selectedFolderId === folder.id
                        ? "text-blue-600 bg-blue-50 dark:bg-blue-900/20 dark:text-blue-400"
                        : "text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                    }`}
                  >
                    <svg
                      className="w-5 h-5"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3.75 9.776c.112-.017.227-.026.344-.026h15.812c.117 0 .232.009.344.026m-16.5 0a2.25 2.25 0 00-1.883 2.542l.857 6a2.25 2.25 0 002.227 1.932H19.05a2.25 2.25 0 002.227-1.932l.857-6a2.25 2.25 0 00-1.883-2.542m-16.5 0V6A2.25 2.25 0 016 3.75h3.879a1.5 1.5 0 011.06.44l2.122 2.12a1.5 1.5 0 001.06.44H18A2.25 2.25 0 0120.25 9v.776"
                      />
                    </svg>
                    <span className="text-sm font-medium">{folder.name}</span>
                  </button>
                  <FolderMenu
                    folderId={folder.id}
                    onDelete={() => handleDeleteFolder(folder.id)}
                  />
                </div>
              ))}

              {/* New Folder Input */}
              {isCreatingFolder && (
                <div className="flex w-full items-center gap-2.5 px-3 py-2 rounded-lg bg-blue-50 dark:bg-blue-900/20">
                  <svg
                    className="w-5 h-5 text-blue-600 dark:text-blue-400"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3.75 9.776c.112-.017.227-.026.344-.026h15.812c.117 0 .232.009.344.026m-16.5 0a2.25 2.25 0 00-1.883 2.542l.857 6a2.25 2.25 0 002.227 1.932H19.05a2.25 2.25 0 002.227-1.932l.857-6a2.25 2.25 0 00-1.883-2.542m-16.5 0V6A2.25 2.25 0 016 3.75h3.879a1.5 1.5 0 011.06.44l2.122 2.12a1.5 1.5 0 001.06.44H18A2.25 2.25 0 0120.25 9v.776"
                    />
                  </svg>
                  <input
                    ref={newFolderInputRef}
                    type="text"
                    value={newFolderName}
                    onChange={(e) => setNewFolderName(e.target.value)}
                    onBlur={handleCreateFolder}
                    onKeyDown={handleKeyDown}
                    placeholder="Enter folder name"
                    className="flex-1 bg-transparent border-none text-sm font-medium text-blue-600 dark:text-blue-400 placeholder-blue-400 dark:placeholder-blue-500 focus:outline-none focus:ring-0"
                    autoFocus
                  />
                </div>
              )}
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 flex flex-col overflow-hidden">
            <Records
              meetings={displayedMeetings}
              onDelete={handleMeetingDelete}
              folders={folders}
              onMoveMeetings={handleMoveMeetings}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
