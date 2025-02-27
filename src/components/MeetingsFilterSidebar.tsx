"use client";
import { Clock, Star, User, Share2 } from "lucide-react";

interface FilterOption {
  id: string;
  label: string;
  icon: React.ReactNode;
  count?: number;
}

interface Props {
  selectedFilter: string;
  onFilterChange: (filterId: string) => void;
}

export default function MeetingsFilterSidebar({
  selectedFilter,
  onFilterChange,
}: Props) {
  const filters: FilterOption[] = [
    {
      id: "recent",
      label: "Recent",
      icon: <Clock className="w-4 h-4" />,
    },
    {
      id: "starred",
      label: "Starred",
      icon: <Star className="w-4 h-4" />,
    },
    {
      id: "created",
      label: "Created by me",
      icon: <User className="w-4 h-4" />,
    },
    {
      id: "shared",
      label: "Shared with me",
      icon: <Share2 className="w-4 h-4" />,
    },
  ];

  return (
    <div className="w-60 border-r border-gray-200 dark:border-gray-700 h-full bg-white dark:bg-gray-800">
      <div className="p-4">
        <h2 className="text-sm font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider mb-4">
          Filters
        </h2>
        <div className="space-y-1">
          {filters.map((filter) => (
            <button
              key={filter.id}
              onClick={() => onFilterChange(filter.id)}
              className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm ${
                selectedFilter === filter.id
                  ? "bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300"
                  : "text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700/50"
              }`}
            >
              {filter.icon}
              <span>{filter.label}</span>
              {filter.count && (
                <span className="ml-auto text-xs text-gray-500 dark:text-gray-400">
                  {filter.count}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
