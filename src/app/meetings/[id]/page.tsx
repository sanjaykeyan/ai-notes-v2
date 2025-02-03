"use client";
import { useEffect, useState, use } from "react";
import { notFound } from "next/navigation";
import { type ActiveTool } from "@/components/MeetingSidebar";
import ScreenA from "@/app/meetings/[id]/screens/ScreenA";
import ScreenB from "@/app/meetings/[id]/screens/ScreenB";
import ScreenC from "@/app/meetings/[id]/screens/ScreenC";
import AudioPlayer from "@/components/AudioPlayer";
import Split from "react-split";
import { PlaybackProvider } from "@/contexts/PlaybackContext";
import {
  ScreenProvider,
  ScreenType,
  useScreen,
} from "@/contexts/ScreenContext";

async function getMeetingData(id: string) {
  const response = await fetch(`/api/meetings/${id}`);
  if (!response.ok) notFound();
  return response.json();
}

interface MeetingPageProps {
  params: Promise<{ id: string }>;
  isSidebarVisible: boolean;
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
  isSidebarVisible,
}: {
  meeting: any;
  bookmarksKey: number;
  handleBookmarksChange: () => void;
  isSidebarVisible: boolean;
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
          <ScreenB summary={meeting.summary ?? ""} />
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
      sizes={isScreenACollapsed ? [5, 57.5, 37.5] : (isSidebarVisible ? [20, 50, 30] : [30, 40, 30])}
      minSize={isScreenACollapsed ? [60, 300, 300] : [150, 300, 300]}
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
        <ScreenB summary={meeting.summary ?? ""} />
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
      <div className="lg:hidden h-[calc(100vh-13rem)]">
        <ScreenSelector />
        <div className="h-[calc(100%-3rem)]">{mobileContent}</div>
      </div>
      {/* Code to change if required to adjust the size of scrABC */}
      <div className="hidden lg:block h-[calc(100vh-12.4rem)]">
        {desktopContent}
      </div>
    </>
  );
}

export default function MeetingPage({
  params,
  isSidebarVisible,
}: MeetingPageProps) {
  const resolvedParams = use(params);
  const [meeting, setMeeting] = useState<any>(null);
  const [bookmarksKey, setBookmarksKey] = useState(0);

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

  if (!meeting) return null;

  return (
    <PlaybackProvider>
      <ScreenProvider>
        <div className="fixed inset-x-0 top-16 bottom-0 flex flex-col bg-white dark:bg-gray-900">
          {" "}
          {/* Adjust positioning */}
          {/* Desktop Title */}
          <header className="h-14 flex-none py-4 px-6 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 lg:block hidden">
            <h1 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              {meeting?.title || "Untitled Meeting"}
            </h1>
          </header>
          {/* Main content */}
          <main className="flex-1 min-h-0 overflow-hidden">
            {meeting && (
              <MeetingContent
                meeting={meeting}
                bookmarksKey={bookmarksKey}
                handleBookmarksChange={handleBookmarksChange}
                isSidebarVisible={isSidebarVisible}
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
        </div>
      </ScreenProvider>
    </PlaybackProvider>
  );
}
