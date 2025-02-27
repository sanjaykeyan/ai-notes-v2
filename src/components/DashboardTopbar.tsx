import React from "react";
import { Search, Zap, HelpCircle, Globe, ChevronDown } from "lucide-react";

export default function DashboardTopbar() {
  return (
    <div className="flex items-center justify-between px-4 py-2 border-b border-gray-200 bg-white">
      {/* Left side - Search bar */}
      <div className="relative flex-1 max-w-md">
        <div className="flex items-center bg-gray-100 rounded-lg px-3 py-1.5">
          <Search className="w-4 h-4 text-gray-500 mr-2" />
          <input
            type="text"
            placeholder="Quick Find"
            className="bg-transparent border-none outline-none text-sm flex-1 text-gray-700"
          />
          <div className="flex items-center gap-1">
            <kbd className="px-1.5 py-0.5 text-xs bg-gray-200 text-gray-500 rounded">
              Ctrl
            </kbd>
            <kbd className="px-1.5 py-0.5 text-xs bg-gray-200 text-gray-500 rounded">
              K
            </kbd>
          </div>
        </div>
      </div>

      {/* Center - Empty space */}
      <div className="flex-1"></div>

      {/* Right side - Actions and profile */}
      <div className="flex items-center gap-4">
        {/* Trial button */}
        <button className="flex items-center gap-1.5 bg-gradient-to-r from-amber-400 to-amber-500 text-white text-sm font-medium px-3 py-1.5 rounded-full">
          <Zap className="w-4 h-4" />
          <span>Start my 3-day trial now</span>
        </button>

        {/* Help button */}
        <button className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200">
          <HelpCircle className="w-5 h-5" />
        </button>

        {/* Globe button */}
        <button className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200">
          <Globe className="w-5 h-5" />
        </button>

        {/* User profile */}
        <div className="flex items-center gap-2">
          {/* User avatar */}
          <div className="flex items-center">
            <div className="w-8 h-8 rounded-full bg-teal-500 flex items-center justify-center text-white font-medium text-sm">
              K
            </div>
            <div className="w-8 h-8 rounded-full bg-amber-500 flex items-center justify-center text-white font-medium text-sm -ml-2">
              S
            </div>
          </div>

          {/* User info */}
          <div className="flex items-center">
            <div className="text-xs">
              <div className="font-medium text-gray-700 flex items-center gap-1">
                keyan.sanj...
                <ChevronDown className="w-4 h-4" />
              </div>
              <div className="text-gray-500">Free Plan</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
