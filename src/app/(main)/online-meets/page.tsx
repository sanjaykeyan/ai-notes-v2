"use client";
import { useState, useEffect } from "react";
import ScreenRecorder from "@/components/ScreenRecorder";
import RecordingModal from "@/components/recording-modal";
import { format } from "date-fns";

const formatDuration = (seconds: number) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.round(seconds % 60);
  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
};

interface OnlineMeeting {
  id: string;
  title: string;
  createdAt: string;
  duration: number;
}

const OnlineMeetsPage = () => {
  const [meetings, setMeetings] = useState<OnlineMeeting[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [recordedAudio, setRecordedAudio] = useState<Blob | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    fetchMeetings();
  }, []);

  const fetchMeetings = async () => {
    try {
      const response = await fetch("/api/online-meetings");
      if (response.ok) {
        const data = await response.json();
        setMeetings(data);
      }
    } catch (error) {
      console.error("Error fetching meetings:", error);
    }
  };

  const handleRecordingComplete = (audioBlob: Blob) => {
    setRecordedAudio(audioBlob);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setRecordedAudio(null);
  };

  return (
    <div className="container mx-auto px-6 pt-24 pb-16">
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

        {/* Main Content Grid */}
        <div className="grid md:grid-cols-[2fr,1fr] gap-8">
          {/* Recording Section */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <ScreenRecorder onRecordingComplete={handleRecordingComplete} />
            {isProcessing && (
              <div className="mt-4 flex items-center gap-3 text-blue-600 animate-pulse">
                <svg
                  className="w-5 h-5 animate-spin"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Processing recording...
              </div>
            )}
          </div>

          {/* Recent Meetings */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-semibold mb-4">Recent Meetings</h2>
            <div className="space-y-4">
              {meetings.map((meeting) => (
                <div
                  key={meeting.id}
                  className="p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer"
                >
                  <h3 className="font-medium text-gray-900">{meeting.title}</h3>
                  <div className="flex items-center justify-between mt-2 text-sm text-gray-500">
                    <span>
                      {format(new Date(meeting.createdAt), "MMM d, h:mm a")}
                    </span>
                    <span>{formatDuration(meeting.duration)}</span>
                  </div>
                </div>
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

        {/* Recording Modal */}
        <RecordingModal
          isOpen={isModalOpen}
          onClose={handleModalClose}
          recordedAudio={recordedAudio}
          onProcessingStart={() => setIsProcessing(true)}
          onProcessingEnd={() => {
            setIsProcessing(false);
            fetchMeetings();
          }}
        />
      </div>
    </div>
  );
};

export default OnlineMeetsPage;
