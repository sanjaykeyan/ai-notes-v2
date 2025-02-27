"use client";
import { useState } from "react";
import MeetingSidebar from "@/components/MeetingSidebar";

interface LayoutProps {
  children: React.ReactNode;
}

export default function MeetingLayout({ children }: LayoutProps) {
  const [selectedTool, setSelectedTool] = useState<"search" | "bookmarks" | "sentiment" | "chat">("search");
  const [isSidebarVisible, setIsSidebarVisible] = useState(true);

  return (
    <div className="flex h-full">
      <div className="flex-1 relative">
        {children}
      </div>
      {isSidebarVisible && (
        <div className="w-14 flex-none">
          <MeetingSidebar
            selectedTool={selectedTool}
            onToolSelect={setSelectedTool}
          />
        </div>
      )}
    </div>
  );
}
