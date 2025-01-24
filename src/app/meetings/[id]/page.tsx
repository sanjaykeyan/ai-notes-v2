"use client";
import { useEffect, useState, use } from "react";
import { notFound } from "next/navigation";
import { type ActiveTool } from "@/components/MeetingSidebar";
import ScreenA from "@/app/meetings/[id]/screens/ScreenA";
import ScreenB from "@/app/meetings/[id]/screens/ScreenB";
import ScreenC from "@/app/meetings/[id]/screens/ScreenC";
import AudioPlayer from "@/components/AudioPlayer";
import Split from "react-split";
import { PlaybackProvider } from '@/contexts/PlaybackContext';

async function getMeetingData(id: string) {
  const response = await fetch(`/api/meetings/${id}`);
  if (!response.ok) notFound();
  return response.json();
}

interface MeetingPageProps {
  params: Promise<{ id: string }>;
  isSidebarVisible: boolean;
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
    getMeetingData(resolvedParams.id).then(data => {
      console.log("Meeting data:", {
        timestampMapping: data.timestampMapping,
        transcript: data.transcript?.slice(0, 100) + "...", // Show first 100 chars
        hasTimestampMapping: Array.isArray(data.timestampMapping),
        timestampMappingLength: data.timestampMapping?.length
      });
      setMeeting(data);
    });
  }, [resolvedParams.id]);

  if (!meeting) return null;

  console.log("Recording URL:", meeting.recordingUrl);

  return (
    <PlaybackProvider>
      <div className="h-full flex flex-col overflow-hidden no-scrollbar pb-[72px] bg-gray-50">
        {/* Meeting Title */}
        <div className="py-4 px-6 flex-shrink-0 bg-white border-b border-gray-200">
          <h1 className="text-lg heading-text">
            {meeting?.title || "Untitled Meeting"}
          </h1>
        </div>

        <Split
          className="flex-1 flex split"
          sizes={isSidebarVisible ? [20, 50, 30] : [30, 40, 30]}
          minSize={[150, 300, 300]}
          gutterSize={4}
          snapOffset={30}
          style={{ transition: "all 0.3s ease" }}
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
        <AudioPlayer 
          audioUrl={meeting.recordingUrl}
          title={meeting.title}
        />
      </div>
    </PlaybackProvider>
  );
}
