"use client";
import React from "react";
import "./meetings.css";
import Navbar from "@/components/navbar";
import BackButton from "@/components/BackButton";
import { usePathname } from 'next/navigation';

export default function MeetingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isSpecificMeeting = pathname.match(/^\/meetings\/[^/]+$/);

  return (
    <div className="h-screen overflow-hidden bg-white meetings-container">
      {isSpecificMeeting ? (
        <>
          {/* Show Back Button on mobile, Navbar on desktop */}
          <div className="lg:block hidden">
            <Navbar />
            <div className="h-[72px]" />
          </div>
          <div className="lg:hidden">
            <div className="sticky top-0 z-50 bg-white border-b flex items-center h-14 px-4">
              <div className="absolute left-2">
                <BackButton />
              </div>
              <div className="flex-1 text-center" id="mobile-title-container" />
            </div>
          </div>
        </>
      ) : (
        /* Show Navbar on all other meeting-related pages */
        <>
          <Navbar />
          <div className="h-[72px]" />
        </>
      )}

      <div className="h-full">
        {children}
      </div>
    </div>
  );
}