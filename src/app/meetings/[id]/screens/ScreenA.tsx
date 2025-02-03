"use client";
import { useState } from "react";
import { MagnifyingGlassIcon, BookmarkIcon } from "@heroicons/react/24/outline";
import { motion, AnimatePresence } from "framer-motion";
import Bookmarks from "./Bookmarks";
import SmartFilters from "./SmartFilters";

const pageVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 1000 : -1000,
    opacity: 0
  }),
  center: {
    x: 0,
    opacity: 1
  },
  exit: (direction: number) => ({
    x: direction < 0 ? 1000 : -1000,
    opacity: 0
  })
};

const pageTransition = {
  type: "tween",
  duration: 0.3,
  ease: [0.25, 0.1, 0.25, 1], // cubic-bezier curve for natural motion
};

interface ScreenAProps {
  meetingId: string;
  onBookmarksChange?: () => void;
}

export default function ScreenA({
  meetingId,
  onBookmarksChange,
}: ScreenAProps) {
  const [selectedView, setSelectedView] = useState<"search" | "bookmarks">(
    "search"
  );
  const [[page, direction], setPage] = useState([0, 0]);

  const handleViewChange = (view: "search" | "bookmarks") => {
    const newDirection = view === "bookmarks" ? 1 : -1;
    setPage([page + 1, newDirection]);
    setSelectedView(view);
  };

  return (
    <div className="h-full flex flex-col sm:flex-row">
      {/* Navigation - horizontal on mobile, vertical sidebar on desktop */}
      <div className="sm:h-full w-full sm:w-[60px] border-b sm:border-b-0 sm:border-r border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 flex-shrink-0">
        <nav className="flex sm:flex-col py-1 px-2 sm:p-2 space-x-1 sm:space-x-0 sm:space-y-2 justify-center sm:justify-start">
          <button
            onClick={() => handleViewChange("search")}
            className={`px-3 py-1.5 sm:p-3 rounded-md flex items-center justify-center sm:justify-start transition-colors duration-200 ${
              selectedView === "search"
                ? "bg-blue-50 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400"
                : "hover:bg-gray-50 dark:hover:bg-gray-700/50"
            }`}
          >
            <MagnifyingGlassIcon className="h-4 w-4 sm:h-5 sm:w-5" />
            <span className="ml-2 text-sm font-medium sm:hidden">Search</span>
          </button>
          <button
            onClick={() => handleViewChange("bookmarks")}
            className={`px-3 py-1.5 sm:p-3 rounded-md flex items-center justify-center sm:justify-start transition-colors duration-200 ${
              selectedView === "bookmarks"
                ? "bg-blue-50 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400"
                : "hover:bg-gray-50 dark:hover:bg-gray-700/50"
            }`}
          >
            <BookmarkIcon className="h-4 w-4 sm:h-5 sm:w-5" />
            <span className="ml-2 text-sm font-medium sm:hidden">Bookmarks</span>
          </button>
        </nav>
      </div>
      {/* Content */}
      <div className="flex-1 bg-white dark:bg-gray-800 backdrop-blur-sm shadow-xl flex flex-col min-w-0 relative overflow-hidden">
        <div className="flex-shrink-0 px-3 py-2 sm:px-4 sm:py-3 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-gray-100">
            {selectedView === "bookmarks" ? "Bookmarks" : "Smart Filters"}
          </h2>
        </div>
        <div className="flex-1 overflow-hidden">
          <AnimatePresence initial={false} custom={direction} mode="wait">
            <motion.div
              key={selectedView}
              custom={direction}
              variants={pageVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={pageTransition}
              className="h-full overflow-y-auto elegant-scrollbar absolute w-full"
            >
              <div className="h-full p-2 sm:p-4">
                {selectedView === "bookmarks" ? (
                  <Bookmarks
                    meetingId={meetingId}
                    onBookmarksChange={onBookmarksChange}
                  />
                ) : (
                  <SmartFilters meetingId={meetingId} />
                )}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
