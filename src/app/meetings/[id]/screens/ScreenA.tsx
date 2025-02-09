"use client";
import { useState, useEffect } from "react";
import {
  MagnifyingGlassIcon,
  BookmarkIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  FaceSmileIcon,
} from "@heroicons/react/24/outline";
import { motion, AnimatePresence } from "framer-motion";
import Bookmarks from "./Bookmarks";
import SmartFilters from "./SmartFilters";
import Sentiment from "./Sentiment";

const pageVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 1000 : -1000,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    x: direction < 0 ? 1000 : -1000,
    opacity: 0,
  }),
};

const pageTransition = {
  type: "tween",
  duration: 0.3,
  ease: [0.25, 0.1, 0.25, 1], // cubic-bezier curve for natural motion
};

interface ScreenAProps {
  meetingId: string;
  onBookmarksChange?: () => void;
  onCollapse?: (collapsed: boolean) => void;
}

export default function ScreenA({
  meetingId,
  onBookmarksChange,
  onCollapse,
}: ScreenAProps) {
  const [selectedView, setSelectedView] = useState<
    "search" | "bookmarks" | "sentiment"
  >("search");
  const [[page, direction], setPage] = useState([0, 0]);
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    onCollapse?.(isCollapsed);
  }, [isCollapsed, onCollapse]);

  const handleViewChange = (view: "search" | "bookmarks" | "sentiment") => {
    const newDirection = view === "search" ? -1 : 1;
    setPage([page + 1, newDirection]);
    setSelectedView(view);
  };

  return (
    <div
      className={`bg-white dark:bg-gray-800 shadow-sm border border-gray-200 dark:border-gray-700 h-full flex flex-col sm:flex-row ${
        isCollapsed ? "sm:w-[60px]" : ""
      }`}
    >
      <div className="sm:h-full w-full sm:w-[60px] border-b sm:border-b-0 sm:border-r border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 flex-shrink-0 h-[calc(100vh-12.4rem)]">
        <nav className="flex sm:flex-col h-full py-1 px-2 sm:p-2 space-x-1 sm:space-x-0 sm:space-y-1">
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden sm:flex px-3 py-1.5 sm:p-3 rounded-md items-center justify-center transition-colors duration-200 hover:bg-gray-50 dark:hover:bg-gray-700/50 mb-1"
            title={isCollapsed ? "Expand" : "Collapse"}
          >
            {isCollapsed ? (
              <ChevronRightIcon className="h-4 w-4 sm:h-5 sm:w-5" />
            ) : (
              <ChevronLeftIcon className="h-4 w-4 sm:h-5 sm:w-5" />
            )}
          </button>
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
            <span className="ml-2 text-sm font-medium sm:hidden">
              Bookmarks
            </span>
          </button>
          <button
            onClick={() => handleViewChange("sentiment")}
            className={`px-3 py-1.5 sm:p-3 rounded-md flex items-center justify-center sm:justify-start transition-colors duration-200 ${
              selectedView === "sentiment"
                ? "bg-blue-50 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400"
                : "hover:bg-gray-50 dark:hover:bg-gray-700/50"
            }`}
          >
            <FaceSmileIcon className="h-4 w-4 sm:h-5 sm:w-5" />
            <span className="ml-2 text-sm font-medium sm:hidden">
              Sentiment
            </span>
          </button>
        </nav>
      </div>
      {!isCollapsed && (
        <div className="flex-1 bg-white dark:bg-gray-800 flex flex-col min-w-0 relative overflow-hidden">
          <div className="flex-shrink-0 px-3 py-2 sm:px-4 sm:py-3 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-gray-100">
              {selectedView === "bookmarks"
                ? "Bookmarks"
                : selectedView === "sentiment"
                ? "Sentiment Analysis"
                : "Smart Filters"}
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
                className="h-[calc(100vh-12.4rem)] overflow-y-auto elegant-scrollbar absolute w-full pr-0"
              >
                <div className="h-[calc(100vh-12.4rem)] pl-2 sm:pl-4">
                  {selectedView === "bookmarks" ? (
                    <Bookmarks
                      meetingId={meetingId}
                      onBookmarksChange={onBookmarksChange}
                    />
                  ) : selectedView === "sentiment" ? (
                    <Sentiment meetingId={meetingId} />
                  ) : (
                    <SmartFilters meetingId={meetingId} />
                  )}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      )}
    </div>
  );
}
