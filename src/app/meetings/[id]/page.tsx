"use client";
import { useEffect, useState, use } from "react";
import { notFound } from "next/navigation";
import ScreenA from "@/app/meetings/[id]/screens/ScreenA";
import ScreenB from "@/app/meetings/[id]/screens/ScreenB";
import ScreenC from "@/app/meetings/[id]/screens/ScreenC";
import AudioPlayer from "@/components/AudioPlayer";
import Split from "react-split";

async function getMeetingData(id: string) {
  const response = await fetch(`/api/meetings/${id}`);
  if (!response.ok) notFound();
  return response.json();
}

export default function MeetingPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const [meeting, setMeeting] = useState<any>(null);

  useEffect(() => {
    getMeetingData(resolvedParams.id).then(setMeeting);
  }, [resolvedParams.id]);

  if (!meeting) return null;

  return (
    <div className="h-full flex flex-col overflow-hidden no-scrollbar pb-[72px] bg-gray-50">
      {/* Meeting Title */}
      <div className="py-4 px-6 flex-shrink-0 bg-white border-b border-gray-200">
        <h1 className="text-lg heading-text">
          {meeting.title || "Untitled Meeting"}
        </h1>
      </div>

      {/* Resizable Three-Panel Layout */}
      <Split
        className="flex-1 flex split px-2"
        sizes={[20, 50, 30]} // Changed from [20, 40, 40] to make the transcript panel smaller
        minSize={[150, 300, 300]}
        gutterSize={4}
        snapOffset={30}
      >
        <div className="overflow-hidden h-full">
          <ScreenA meetingId={meeting.id} />
        </div>
        <div className="overflow-hidden h-full">
          <ScreenB summary={meeting.summary ?? ""} />
        </div>
        <div className="overflow-hidden h-full">
          <ScreenC
            transcript={meeting.transcript ?? ""}
            meetingId={meeting.id}
          />
        </div>
      </Split>

      <AudioPlayer />
    </div>
  );
}
