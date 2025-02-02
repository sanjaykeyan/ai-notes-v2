'use client'

import { Plus, HelpCircle } from "lucide-react";
import { useState } from "react";
import DeleteMeetingButton from "./DeleteMeetingButton";
import { Meeting } from "@prisma/client";
import UploadMeetingModal from "./upload-meeting-modal";
import HelpModal from "./HelpModal"; // We'll create this component next

interface MobileDashboardProps {
  firstName: string;
  recentMeetings: Meeting[];
}

const MobileDashboard = ({ firstName, recentMeetings }: MobileDashboardProps) => {
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);

  const handleUploadClick = () => {
    setIsUploadModalOpen(true);
  };

  return (
    <>
      <div className="flex flex-col gap-2 h-full">
        {/* Welcome Section with Help Button */}
        <div className="text-center relative py-1">
          <h1 className="text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Welcome {firstName}!
          </h1>
          <button 
            onClick={() => setIsHelpModalOpen(true)}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
          >
            <HelpCircle className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* Recent Meetings */}
        <div className="bg-white/70 backdrop-blur-sm rounded-xl shadow-lg p-3 flex-1 flex flex-col min-h-0">
          <h2 className="text-base font-semibold mb-2">Recent Meetings</h2>
          <div className="flex-1 overflow-y-auto">
            {recentMeetings.length > 0 ? (
              <div className="space-y-1">
                {recentMeetings.map((meeting) => (
                  <div
                    key={meeting.id}
                    className="border-b border-gray-100 last:border-0 py-2"
                  >
                    <div className="flex items-center justify-between">
                      <a
                        href={`/meetings/${meeting.id}`}
                        className="text-blue-600 text-sm font-medium truncate flex-1"
                      >
                        {meeting.title || "Untitled Meeting"}
                      </a>
                      <DeleteMeetingButton id={meeting.id} />
                    </div>
                    <p className="text-xs text-gray-500">
                      {new Date(meeting.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500 text-center py-4">
                Tap + to upload your first meeting!
              </p>
            )}
          </div>
        </div>

        {/* Upload Button */}
        <div className="fixed bottom-5 inset-x-0 flex justify-center z-10">
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full blur opacity-60 group-hover:opacity-75 transition duration-200"></div>
            <button
              onClick={handleUploadClick}
              className="relative flex items-center justify-center w-10 h-10 bg-white rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition duration-200"
            >
              <Plus className="w-4 h-4 text-blue-600" />
            </button>
          </div>
        </div>
      </div>

      {/* Modals */}
      <UploadMeetingModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onProcessingStart={() => {}}
        onProcessingEnd={() => {}}
      />
      
      <HelpModal
        isOpen={isHelpModalOpen}
        onClose={() => setIsHelpModalOpen(false)}
      />
    </>
  );
};

export default MobileDashboard;
