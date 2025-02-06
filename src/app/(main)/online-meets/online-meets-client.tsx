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
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 sm:px-6 pt-16 pb-16">
        <div className="max-w-6xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold bg-gradient-to-r from-gray-900 via-gray-700 to-gray-800 dark:from-gray-100 dark:via-gray-200 dark:to-gray-100 bg-clip-text text-transparent mb-4">
              Online Meetings
            </h1>
            <p className="text-gray-600 dark:text-gray-300 text-lg max-w-2xl mx-auto">
              Record, transcribe, and organize your online meetings
              effortlessly. Start by clicking the record button below.
            </p>
          </div>

          {/* Status Indicator */}
          <div className="flex justify-center mb-10">
            <div className="flex items-center gap-3 px-4 py-2 bg-white dark:bg-gray-800 rounded-full shadow-sm border border-gray-100 dark:border-gray-700">
              <span className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse"></span>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
                Ready to record
              </span>
            </div>
          </div>

          <div className="grid lg:grid-cols-[1.5fr,1fr] gap-8">
            {/* Recording Section */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md border border-gray-200 dark:border-gray-700 p-8 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-transparent to-transparent dark:from-gray-900/50 dark:via-transparent dark:to-transparent opacity-50"></div>
              <div className="relative">
                <ScreenRecorder onRecordingComplete={handleRecordingComplete} />
                {isProcessing && (
                  <div className="mt-4 flex items-center justify-center gap-2 text-gray-600 dark:text-gray-300">
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="none"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                      />
                    </svg>
                    <span className="font-medium">Processing recording...</span>
                  </div>
                )}
                <div className="mt-4 p-4 rounded-lg bg-gray-50/80 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700">
                  <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">
                    Recording Instructions:
                  </h3>
                  <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                    <li className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-300 flex items-center justify-center text-xs font-medium">
                        1
                      </span>
                      Click "Start Recording" to begin
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-300 flex items-center justify-center text-xs font-medium">
                        2
                      </span>
                      Grant microphone permissions when prompted
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-300 flex items-center justify-center text-xs font-medium">
                        3
                      </span>
                      Click "Stop Recording" when finished
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Recent Meetings Section */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md border border-gray-200 dark:border-gray-700 p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                  <svg
                    className="w-5 h-5 text-gray-500 dark:text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  Recent Meetings
                </h2>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {meetings.length} recordings
                </span>
              </div>

              <div className="space-y-4">
                {meetings.map((meeting) => (
                  <Link
                    key={meeting.id}
                    href={`/meetings/${meeting.id}`}
                    className="block group"
                  >
                    <div className="relative p-4 rounded-xl bg-gray-50 dark:bg-gray-700/50 hover:bg-white dark:hover:bg-gray-700 transition-all duration-200 border border-gray-200 dark:border-gray-600 hover:shadow-lg hover:-translate-y-0.5">
                      <div className="absolute right-4 top-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Completed
                        </span>
                      </div>

                      <h3 className="font-medium text-gray-900 dark:text-gray-100 group-hover:text-black dark:group-hover:text-white line-clamp-1 pr-24">
                        {meeting.title}
                      </h3>

                      <div className="mt-4 flex items-center gap-6 text-sm">
                        <span className="text-gray-600 flex items-center gap-1.5">
                          <svg
                            className="w-4 h-4 text-gray-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                          </svg>
                          {format(new Date(meeting.createdAt), "MMM d, h:mm a")}
                        </span>
                        <span className="text-gray-600 flex items-center gap-1.5">
                          <svg
                            className="w-4 h-4 text-gray-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                          {formatDuration(meeting.duration)}
                        </span>
                      </div>

                      <div className="mt-3 flex items-center gap-2">
                        <span className="inline-flex items-center gap-1 text-xs text-gray-500">
                          <svg
                            className="w-3 h-3"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                          Transcribed
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
                {meetings.length === 0 && (
                  <div className="text-center py-12 bg-gray-50 dark:bg-gray-700/50 rounded-xl border-2 border-dashed border-gray-200 dark:border-gray-600">
                    <div className="bg-white dark:bg-gray-800 p-4 rounded-full w-16 h-16 mx-auto mb-4 shadow-sm flex items-center justify-center">
                      <svg
                        className="w-8 h-8 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="1.5"
                          d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                        />
                      </svg>
                    </div>
                    <p className="font-medium text-gray-900 dark:text-gray-100">
                      No recordings yet
                    </p>
                    <p className="text-sm mt-1 text-gray-500 dark:text-gray-400 max-w-sm mx-auto">
                      Your recorded meetings will appear here. Start by
                      recording your first meeting above.
                    </p>
                  </div>
                )}
              </div>
            </div>
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
  );
}
