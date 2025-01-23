"use client";
import { MagnifyingGlassIcon, BookmarkIcon } from "@heroicons/react/24/outline";

export type ActiveTool = "search" | "bookmarks";

interface SidebarProps {
  selectedTool: ActiveTool;
  onToolSelect: (tool: ActiveTool) => void;
}

export default function Sidebar({ selectedTool, onToolSelect }: SidebarProps) {
  return (
    <div className="h-full w-[60px] border-r border-gray-200 bg-white">
      <nav className="p-2 space-y-2">
        <button
          onClick={() => onToolSelect("search")}
          className={`w-full p-3 rounded-md ${
            selectedTool === "search" ? "bg-gray-100" : ""
          }`}
        >
          <MagnifyingGlassIcon className="h-5 w-5" />
        </button>
        <button
          onClick={() => onToolSelect("bookmarks")}
          className={`w-full p-3 rounded-md ${
            selectedTool === "bookmarks" ? "bg-gray-100" : ""
          }`}
        >
          <BookmarkIcon className="h-5 w-5" />
        </button>
      </nav>
    </div>
  );
}
