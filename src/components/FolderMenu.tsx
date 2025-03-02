"use client";

import { useState, useRef } from "react";
import { useClickAway } from "react-use";

interface FolderMenuProps {
  folderId: string;
  onDelete: () => void;
}

export default function FolderMenu({ folderId, onDelete }: FolderMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

  useClickAway(menuRef, () => {
    setIsOpen(false);
  });

  return (
    <div ref={menuRef} className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <svg
          className="w-4 h-4 text-gray-500 dark:text-gray-400"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 6.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 12.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 18.75a.75.75 0 110-1.5.75.75 0 010 1.5z"
          />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-1 w-48 rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 z-10">
          <div className="py-1">
            <button
              onClick={() => {
                onDelete();
                setIsOpen(false);
              }}
              className="w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
            >
              Delete Folder
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
