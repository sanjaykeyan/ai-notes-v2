"use client";
import { useEffect, useState } from "react";
import Chatbot from "@/components/Chatbot/Chatbot";

interface ChatViewProps {
  meetingId: string;
}

export default function ChatView({ meetingId }: ChatViewProps) {
  const [meetingData, setMeetingData] = useState<{
    transcript: string;
    summary: string;
  } | null>(null);

  useEffect(() => {
    const fetchMeetingData = async () => {
      try {
        const response = await fetch(`/api/meetings/${meetingId}`);
        const data = await response.json();
        setMeetingData({
          transcript: data.transcript || "",
          summary: data.summary || "",
        });
      } catch (error) {
        console.error("Error fetching meeting data for chat:", error);
      }
    };

    fetchMeetingData();
  }, [meetingId]);

  if (!meetingData) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="h-full w-[calc(100%+1rem)] -ml-2 sm:-ml-4 pr-4"> {/* Updated width and padding */}
      <Chatbot transcript={meetingData.transcript} summary={meetingData.summary} />
    </div>
  );
}
