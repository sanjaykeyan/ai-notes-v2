"use client";
import { useState } from "react";
import DashboardTopbar from "@/components/DashboardTopbar";
import MyRecordsSection from "@/components/MyRecordsSection";
import MeetingsFilterSidebar from "@/components/MeetingsFilterSidebar";

interface Meeting {
  id: string;
  title: string;
  createdAt: string;
  duration: number;
}

interface Props {
  initialMeetings: Meeting[];
}

export default function MeetingsClient({ initialMeetings }: Props) {
  const [selectedFilter, setSelectedFilter] = useState("recent");
  const [meetings, setMeetings] = useState(initialMeetings);

  const handleFilterChange = (filterId: string) => {
    setSelectedFilter(filterId);
    // Add filter logic here when needed
  };

  return (
    <>
      <DashboardTopbar />
      <div className="flex flex-1 overflow-hidden">
        <MeetingsFilterSidebar
          selectedFilter={selectedFilter}
          onFilterChange={handleFilterChange}
        />
        <div className="flex-1 p-6 overflow-auto">
          <div className="mb-6">
            <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
              All Records
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Browse and manage your meeting recordings
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
            <MyRecordsSection meetings={meetings} />
          </div>
        </div>
      </div>
    </>
  );
}
