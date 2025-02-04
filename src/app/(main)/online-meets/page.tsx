"use client";
import { useState, useEffect } from "react";
import ScreenRecorder from "@/components/ScreenRecorder";
import { format } from "date-fns";

interface OnlineMeeting {
  id: string;
  title: string;
  createdAt: string;
  duration: number;
}

const OnlineMeetsPage = () => {
  const [activeTab, setActiveTab] = useState("upcoming");
  const [meetings, setMeetings] = useState<OnlineMeeting[]>([]);
  const [isUploading, setIsUploading] = useState(false);

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

  const handleRecordingComplete = async (audioBlob: Blob) => {
    try {
      setIsUploading(true);
      const formData = new FormData();
      formData.append("audio", audioBlob);
      formData.append("title", `Meeting ${new Date().toLocaleString()}`);

      const response = await fetch("/api/online-meetings", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        await fetchMeetings();
      }
    } catch (error) {
      console.error("Error uploading recording:", error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="container mx-auto px-6 pt-24 pb-16">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Online Meetings</h1>

        {/* Recording Section */}
        <div className="mb-8">
          <ScreenRecorder onRecordingComplete={handleRecordingComplete} />
          {isUploading && (
            <p className="text-blue-600 mt-2">Processing recording...</p>
          )}
        </div>

        {/* Meetings List */}
        <div className="space-y-4">
          {meetings.map((meeting) => (
            <div
              key={meeting.id}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-lg">{meeting.title}</h3>
                  <p className="text-gray-500 text-sm">
                    {format(new Date(meeting.createdAt), "PPp")}
                  </p>
                </div>
                <span className="text-gray-500 text-sm">
                  {Math.round(meeting.duration / 60)} mins
                </span>
              </div>
            </div>
          ))}

          {meetings.length === 0 && (
            <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-gray-200">
              <p className="text-gray-500">No recordings found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OnlineMeetsPage;
