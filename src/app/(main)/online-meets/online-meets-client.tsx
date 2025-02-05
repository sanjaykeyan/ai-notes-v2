"use client";
import { useState } from "react";
import Link from "next/link";
import ScreenRecorder from "@/components/ScreenRecorder";
import RecordingModal from "@/components/recording-modal";
import { format } from "date-fns";

interface OnlineMeeting {
  id: string;
  title: string;
  createdAt: string;
  duration: number;
  isLiveRecorded: boolean;
}

interface Props {
  initialMeetings: OnlineMeeting[];
}

const formatDuration = (seconds: number) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.round(seconds % 60);
  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
};

export default function OnlineMeetsClient({ initialMeetings }: Props) {
  const [meetings, setMeetings] = useState<OnlineMeeting[]>(initialMeetings);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [recordedAudio, setRecordedAudio] = useState<Blob | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleRecordingComplete = (audioBlob: Blob) => {
    setRecordedAudio(audioBlob);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setRecordedAudio(null);
  };

  const refreshMeetings = async () => {
    try {
      const response = await fetch("/api/online-meetings");
      if (response.ok) {
        const data = await response.json();
        setMeetings(
          data.filter((meeting: OnlineMeeting) => meeting.isLiveRecorded)
        );
      }
    } catch (error) {
      console.error("Error fetching meetings:", error);
    }
  };

  return (
    <div className="container mx-auto px-6 pt-24 pb-16">
      {/* ...existing code for layout... */}
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
            Online Meetings
          </h1>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <span className="w-2 h-2 rounded-full bg-green-500"></span>
            Ready to record
          </div>
        </div>

        <div className="grid md:grid-cols-[2fr,1fr] gap-8">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <ScreenRecorder onRecordingComplete={handleRecordingComplete} />
            {/* ...existing processing indicator... */}
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-semibold mb-4">Recent Meetings</h2>
            <div className="space-y-4">
              {meetings.map((meeting) => (
                <Link
                  key={meeting.id}
                  href={`/meetings/${meeting.id}`}
                  className="block"
                >
                  <div className="p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer">
                    <h3 className="font-medium text-gray-900">
                      {meeting.title}
                    </h3>
                    <div className="flex items-center justify-between mt-2 text-sm text-gray-500">
                      <span>
                        {format(new Date(meeting.createdAt), "MMM d, h:mm a")}
                      </span>
                      <span>{formatDuration(meeting.duration)}</span>
                    </div>
                  </div>
                </Link>
              ))}
              {meetings.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <p>No recordings yet</p>
                  <p className="text-sm mt-1">
                    Your recorded meetings will appear here
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        <RecordingModal
          isOpen={isModalOpen}
          onClose={handleModalClose}
          recordedAudio={recordedAudio}
          onProcessingStart={() => setIsProcessing(true)}
          onProcessingEnd={() => {
            setIsProcessing(false);
            refreshMeetings();
          }}
        />
      </div>
    </div>
  );
}
