"use client";
import React, { useState } from "react";
import { Search, HelpCircle, DollarSign } from "lucide-react";
import { UserButton } from "@clerk/nextjs";
import HelpDialog from "@/components/HelpDialog";
import Link from "next/link";

export default function DashboardTopbar() {
  const [showHelpDialog, setShowHelpDialog] = useState(false);

  return (
    <div className="flex items-center justify-between px-4 py-2 border-b border-gray-200/10 bg-[#f8f9fa] dark:bg-gray-900 dark:border-gray-800">
      {/* Left side - Search bar */}
      <div className="w-72">
        <div className="flex items-center bg-white dark:bg-gray-800 rounded-lg px-3 py-1.5 border border-gray-200/20 dark:border-gray-700/50">
          <Search className="w-4 h-4 text-gray-400 dark:text-gray-500 mr-2" />
          <input
            type="text"
            placeholder="Quick Find"
            className="bg-transparent border-none outline-none text-sm w-full text-gray-700 dark:text-gray-300 placeholder-gray-400 dark:placeholder-gray-500"
          />
          <div className="flex items-center gap-1 flex-shrink-0">
            <kbd className="px-1.5 py-0.5 text-xs bg-gray-50 dark:bg-gray-700 text-gray-500 dark:text-gray-400 rounded border border-gray-200/20 dark:border-gray-600/50">
              Ctrl
            </kbd>
            <kbd className="px-1.5 py-0.5 text-xs bg-gray-50 dark:bg-gray-700 text-gray-500 dark:text-gray-400 rounded border border-gray-200/20 dark:border-gray-600/50">
              K
            </kbd>
          </div>
        </div>
      </div>

      {/* Right side - Actions and profile */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => setShowHelpDialog(true)}
          className="flex items-center justify-center w-8 h-8 rounded-full bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 border border-gray-200/20 dark:border-gray-700/50"
        >
          <HelpCircle className="w-5 h-5" />
        </button>

        <Link
          href="/pricing"
          className="flex items-center justify-center w-8 h-8 rounded-full bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 border border-gray-200/20 dark:border-gray-700/50"
        >
          <DollarSign className="w-5 h-5" />
        </Link>

        <div className="flex-shrink-0">
          <UserButton
            afterSignOutUrl="/"
            appearance={{
              elements: {
                avatarBox: "w-8 h-8",
                userPreviewMainIdentifier: "text-sm font-medium",
                userPreviewSecondaryIdentifier: "text-xs text-gray-500",
              },
            }}
          />
        </div>
      </div>

      {/* Help Dialog */}
      <HelpDialog
        open={showHelpDialog}
        onClose={() => setShowHelpDialog(false)}
      />
    </div>
  );
}
