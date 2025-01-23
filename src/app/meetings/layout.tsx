"use client";
import React from "react";
import "./meetings.css";

export default function MeetingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-screen overflow-hidden pt-[72px] bg-white meetings-container">
      <div className="h-full flex flex-col">
        <div className="flex-1 flex">
          <div className="h-full flex-1">{children}</div>
        </div>
      </div>
    </div>
  );
}
