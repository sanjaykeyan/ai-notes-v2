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
import { ScreenProvider, ScreenType, useScreen } from "@/contexts/ScreenContext";

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
    <div className="sticky top-0 z-10">
      <div className="flex p-2 gap-1 bg-white border-b shadow-sm">
        {[
          { id: 'filters', label: 'Filters' },
          { id: 'summary', label: 'Summary' },
          { id: 'transcript', label: 'Transcript' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveScreen(tab.id as ScreenType)}
            className={`
              flex-1 px-4 py-2.5 text-sm font-medium rounded-lg
              transition-all duration-200 ease-in-out
              ${activeScreen === tab.id
                ? 'bg-indigo-50 text-indigo-700 ring-1 ring-indigo-700/10'
                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
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
  isSidebarVisible
}: {
  meeting: any;
  bookmarksKey: number;
  handleBookmarksChange: () => void;
  isSidebarVisible: boolean;
}) {
  const { activeScreen } = useScreen();

  // Mobile view (single screen)
  const mobileContent = (
    <div className="flex-1 h-full overflow-hidden">
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
      className="h-[calc(100vh-180px)] flex split" // Updated height calculation
      sizes={isSidebarVisible ? [20, 50, 30] : [30, 40, 30]}
      minSize={[150, 300, 300]}
      gutterSize={4}
      snapOffset={30}
    >
      <div className="overflow-hidden h-full">
        <ScreenA
          meetingId={meeting.id}
          onBookmarksChange={handleBookmarksChange}
        />
      </div>
      <div className="overflow-hidden h-full">
        <ScreenB summary={meeting.summary ?? ""} />
      </div>
      <div className="overflow-hidden h-full">
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
      <div className="lg:hidden h-[calc(100vh-180px)]">
        <ScreenSelector />
        {mobileContent}
      </div>
      <div className="hidden lg:block h-full">{desktopContent}</div>
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
        transcript: data.transcript?.slice(0, 100) + "...", // Show first 100 chars
        hasTimestampMapping: Array.isArray(data.timestampMapping),
        timestampMappingLength: data.timestampMapping?.length,
      });
      setMeeting(data);
    });
  }, [resolvedParams.id]);

  useEffect(() => {
    const mobileTitle = document.getElementById('mobile-title');
    const mobileTitleContainer = document.getElementById('mobile-title-container');
    
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

  console.log("Recording URL:", meeting.recordingUrl);

  return (
    <PlaybackProvider>
      <ScreenProvider>
        <div className="h-full flex flex-col overflow-hidden no-scrollbar pb-[72px] bg-gray-50">
          {/* Desktop Title */}
          <div className="py-4 px-6 flex-shrink-0 bg-white border-b border-gray-200 lg:block hidden">
            <h1 className="text-lg heading-text">
              {meeting?.title || "Untitled Meeting"}
            </h1>
          </div>
          {/* Mobile Title */}
          <h1 className="lg:hidden text-base font-medium truncate" id="mobile-title">
            {meeting?.title || "Untitled Meeting"}
          </h1>
          {meeting && (
            <MeetingContent
              meeting={meeting}
              bookmarksKey={bookmarksKey}
              handleBookmarksChange={handleBookmarksChange}
              isSidebarVisible={isSidebarVisible}
            />
          )}
          <AudioPlayer
            audioUrl={meeting?.recordingUrl}
            title={meeting?.title}
          />
        </div>
      </ScreenProvider>
    </PlaybackProvider>
  );
}