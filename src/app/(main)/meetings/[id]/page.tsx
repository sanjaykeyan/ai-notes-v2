"use client";
import { useEffect, useState, use } from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Pencil } from "lucide-react"; // Add this import
import { renameMeeting } from "@/app/api/meetings/actions"; // Add this import
import { type ActiveTool } from "@/components/MeetingSidebar";
import ScreenA from "@/app/(main)/meetings/[id]/screens/ScreenA";
import ScreenB from "@/app/(main)/meetings/[id]/screens/ScreenB";
import ScreenC from "@/app/(main)/meetings/[id]/screens/ScreenC";
import AudioPlayer from "@/components/AudioPlayer";
import Split from "react-split";
import { PlaybackProvider } from "@/contexts/PlaybackContext";
import {
  ScreenProvider,
  ScreenType,
  useScreen,
} from "@/contexts/ScreenContext";
import { ChatProvider, useChat } from "@/contexts/ChatContext";
import Chatbot from "@/components/Chatbot/Chatbot";

async function getMeetingData(id: string) {
  const response = await fetch(`/api/meetings/${id}`);
  if (!response.ok) notFound();
  return response.json();
}

interface MeetingPageProps {
  params: Promise<{ id: string }>;
}

function ScreenSelector() {
  const { activeScreen, setActiveScreen } = useScreen();
  return (
    <div className="sticky top-0 z-40">
      <div className="flex p-2 gap-1 bg-white dark:bg-gray-800 border-b dark:border-gray-700 shadow-sm">
        {[
          { id: "filters", label: "Filters" },
          { id: "summary", label: "Summary" },
          { id: "transcript", label: "Transcript" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveScreen(tab.id as ScreenType)}
            className={`
              flex-1 px-4 py-2.5 text-sm font-medium rounded-lg
              transition-all duration-200 ease-in-out
              ${
                activeScreen === tab.id
                  ? "bg-indigo-50 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 ring-1 ring-indigo-700/10 dark:ring-indigo-300/10"
                  : "text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-gray-100"
              }
            `}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
}

function MeetingContent({
  meeting,
  bookmarksKey,
  handleBookmarksChange,
}: {
  meeting: any;
  bookmarksKey: number;
  handleBookmarksChange: () => void;
}) {
  const { activeScreen } = useScreen();
  const [isScreenACollapsed, setIsScreenACollapsed] = useState(false);

  // Mobile view (single screen)
  const mobileContent = (
    <div className="flex-1 h-full overflow-y-auto">
      <div className="h-full transition-opacity duration-200 ease-in-out">
        {activeScreen === "filters" && (
          <ScreenA
            meetingId={meeting.id}
            onBookmarksChange={handleBookmarksChange}
          />
        )}
        {activeScreen === "summary" && (
          <ScreenB summary={meeting.summary ?? ""} meetingId={meeting.id} />
        )}
        {activeScreen === "transcript" && (
          <ScreenC
            transcript={meeting.transcript ?? ""}
            meetingId={meeting.id}
            timestampMapping={meeting.timestampMapping ?? []}
            onBookmarkCreate={handleBookmarksChange}
          />
        )}
      </div>
    </div>
  );

  // Desktop view (split screens)
  const desktopContent = (
    <Split
      className="h-full flex split"
      sizes={isScreenACollapsed ? [2, 49, 49] : [30, 35, 35]}
      minSize={isScreenACollapsed ? [60, 200, 200] : [150, 300, 300]}
      gutterSize={4}
      snapOffset={30}
    >
      <div className="overflow-y-auto h-full">
        <ScreenA
          meetingId={meeting.id}
          onBookmarksChange={handleBookmarksChange}
          onCollapse={setIsScreenACollapsed}
        />
      </div>
      <div className="overflow-y-auto h-full">
        <ScreenB summary={meeting.summary ?? ""} meetingId={meeting.id} />
      </div>
      <div className="overflow-y-auto h-full">
        <ScreenC
          transcript={meeting.transcript ?? ""}
          meetingId={meeting.id}
          timestampMapping={meeting.timestampMapping ?? []}
          onBookmarkCreate={handleBookmarksChange}
        />
      </div>
    </Split>
  );

  return (
    <>
      <div className="lg:hidden h-[calc(100vh-14rem)]">
        {" "}
        {/* Changed from 15rem to 12rem */}
        <ScreenSelector />
        <div className="h-[calc(100%-3rem)]">{mobileContent}</div>
      </div>
      {/* Code to change if required to adjust the size of scrABC */}
      <div className="hidden lg:block h-[calc(100vh-8.4rem)]">
        {" "}
        {/* Changed from 12.4rem to 9.4rem */}
        {desktopContent}
      </div>
    </>
  );
}

export default function MeetingPage({ params }: MeetingPageProps) {
  const resolvedParams = use(params);
  const [meeting, setMeeting] = useState<any>(null);
  const [bookmarksKey, setBookmarksKey] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [editingTitle, setEditingTitle] = useState("");
  const { isChatOpen } = useChat();

  const handleBookmarksChange = () => {
    setBookmarksKey((prev) => prev + 1);
  };

  useEffect(() => {
    getMeetingData(resolvedParams.id).then((data) => {
      console.log("Meeting data:", {
        timestampMapping: data.timestampMapping,
        transcript: data.transcript?.slice(0, 100) + "...",
        hasTimestampMapping: Array.isArray(data.timestampMapping),
        timestampMappingLength: data.timestampMapping?.length,
      });
      setMeeting(data);
    });
  }, [resolvedParams.id]);

  useEffect(() => {
    const mobileTitle = document.getElementById("mobile-title");
    const mobileTitleContainer = document.getElementById(
      "mobile-title-container"
    );

    if (mobileTitle && mobileTitleContainer) {
      mobileTitleContainer.appendChild(mobileTitle);
    }

    return () => {
      if (mobileTitle && mobileTitleContainer) {
        try {
          mobileTitleContainer.removeChild(mobileTitle);
        } catch (e) {
          // Handle case where child is already removed
        }
      }
    };
  }, [meeting?.title]);

  const handleStartRename = () => {
    setIsEditing(true);
    setEditingTitle(meeting?.title || "Untitled Meeting");
  };

  const handleRename = async () => {
    if (!editingTitle.trim()) return;

    try {
      await renameMeeting(meeting.id, editingTitle);
      setMeeting({ ...meeting, title: editingTitle });
    } catch (error) {
      console.error("Failed to rename meeting:", error);
    } finally {
      setIsEditing(false);
    }
  };

  const handleRenameKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleRename();
    } else if (e.key === "Escape") {
      setIsEditing(false);
    }
  };

  if (!meeting) return null;

  return (
    <PlaybackProvider>
      <ScreenProvider>
        <div className="h-full flex flex-col bg-white dark:bg-gray-900">
          {/* Desktop Title */}
          <header className="h-14 flex-none py-4 px-6 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 lg:block hidden">
            <div className="flex items-center">
              <Link
                href="/meetings"
                className="mr-4 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 19l-7-7m0 0l7-7m-7 7h18"
                  />
                </svg>
              </Link>
              <div className="flex items-center gap-2">
                {isEditing ? (
                  <div className="flex items-center">
                    <input
                      type="text"
                      value={editingTitle}
                      onChange={(e) => setEditingTitle(e.target.value)}
                      onBlur={handleRename}
                      onKeyDown={handleRenameKeyDown}
                      className="bg-white dark:bg-gray-800 border border-blue-500 dark:border-blue-400 rounded px-2 py-1 text-base text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                      autoFocus
                    />
                    <span className="ml-2 text-xs text-gray-400">
                      Press Enter to save
                    </span>
                  </div>
                ) : (
                  <>
                    <h1 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                      {meeting?.title || "Untitled Meeting"}
                    </h1>
                    <button
                      onClick={handleStartRename}
                      className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
                      title="Rename meeting"
                    >
                      <Pencil className="w-4 h-4 text-gray-400 hover:text-blue-500" />
                    </button>
                  </>
                )}
              </div>
            </div>
          </header>
          {/* Main content */}
          <main className="flex-1 min-h-0 overflow-hidden">
            {meeting && (
              <MeetingContent
                meeting={meeting}
                bookmarksKey={bookmarksKey}
                handleBookmarksChange={handleBookmarksChange}
              />
            )}
          </main>
          {/* Audio player */}
          <footer className="h-20 flex-none bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
            <AudioPlayer
              audioUrl={meeting?.recordingUrl}
              title={meeting?.title}
            />
          </footer>
          {isChatOpen && meeting && (
            <div className="fixed right-0 bottom-20 w-96 z-50 bg-white dark:bg-gray-800 shadow-lg rounded-tl-lg border-t border-l border-gray-200 dark:border-gray-700">
              <Chatbot
                transcript={meeting.transcript}
                summary={meeting.summary}
              />
            </div>
          )}
        </div>
      </ScreenProvider>
    </PlaybackProvider>
  );
}
