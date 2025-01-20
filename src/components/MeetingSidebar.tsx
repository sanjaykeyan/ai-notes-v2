"use client";
import { useState } from "react";
import {
  MagnifyingGlassIcon,
  BookmarkIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "@heroicons/react/24/outline";

export default function Sidebar() {
  const [isVisible, setIsVisible] = useState(true);

  return (
    <>
      {/* Collapse Button when sidebar is hidden */}
      {!isVisible && (
        <button
          onClick={() => setIsVisible(true)}
          className="fixed left-0 top-[50%] mt-[36px] -translate-y-1/2 bg-white p-2 shadow-md rounded-r-md border border-l-0 border-gray-200 hover:bg-gray-50 z-20"
        >
          <ChevronRightIcon className="h-4 w-4 text-gray-500" />
        </button>
      )}

      {/* Sidebar */}
      <div
        className={`h-[calc(100vh-72px)] w-[60px] flex flex-col border-r border-gray-200 bg-white transition-all duration-300 z-10 ${
          isVisible ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Collapse Button at Top */}
        <div className="p-2 border-b border-gray-200">
          <button
            onClick={() => setIsVisible(false)}
            className="w-full p-3 text-gray-700 hover:bg-gray-100 rounded-md flex items-center justify-center"
          >
            <ChevronLeftIcon className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-2 space-y-2">
          <div className="group relative">
            <button className="w-full p-3 text-gray-700 hover:bg-gray-100 rounded-md flex items-center justify-center">
              <MagnifyingGlassIcon className="h-5 w-5" />
            </button>
            <div className="absolute left-full top-1/2 -translate-y-1/2 ml-2 px-3 py-1.5 bg-white/95 backdrop-blur-sm shadow-lg border border-gray-100 text-gray-700 text-sm rounded-md whitespace-nowrap opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none z-50">
              Smart Search
            </div>
          </div>

          <div className="group relative">
            <button className="w-full p-3 text-gray-700 hover:bg-gray-100 rounded-md flex items-center justify-center">
              <BookmarkIcon className="h-5 w-5" />
            </button>
            <div className="absolute left-full top-1/2 -translate-y-1/2 ml-2 px-3 py-1.5 bg-white/95 backdrop-blur-sm shadow-lg border border-gray-100 text-gray-700 text-sm rounded-md whitespace-nowrap opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none z-50">
              Bookmarks
            </div>
          </div>
        </nav>
      </div>
    </>
  );
}
