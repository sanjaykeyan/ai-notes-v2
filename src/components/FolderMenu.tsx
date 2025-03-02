"use client";

import { useState, useRef } from "react";
import { useOnClickOutside } from "@/hooks/use-on-click-outside";

interface FolderMenuProps {
  folderId: string;
  onDelete: () => void;
}

export default function FolderMenu({ folderId, onDelete }: FolderMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useOnClickOutside(menuRef, () => setIsOpen(false));

  return (
    <div ref={menuRef} className="relative flex items-center">
      <button
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen(!isOpen);
        }}
        className="p-1 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200"
      >
        <svg
          className="w-5 h-5 text-gray-500 dark:text-gray-400"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
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
        <div
          className="fixed w-48 rounded-lg bg-white dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-700 py-1 z-[60]"
          style={{
            top: menuRef.current
              ? menuRef.current.getBoundingClientRect().top
              : 0,
            left: menuRef.current
              ? menuRef.current.getBoundingClientRect().right - 192
              : 0, // 192 = w-48
          }}
        >
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
              setIsOpen(false);
            }}
            className="w-full px-4 py-2 text-left text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
          >
            Delete Folder
          </button>
        </div>
      )}
    </div>
  );
}
