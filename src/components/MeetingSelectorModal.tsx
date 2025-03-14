import { useState, useEffect, Fragment, useMemo } from "react";
import { Dialog, Transition } from "@headlessui/react";
import {
  X,
  Check,
  Loader2,
  Search,
  Calendar,
  Clock,
  ChevronDown,
  Tag,
} from "lucide-react";
import toast from "react-hot-toast";

type Meeting = {
  id: string;
  title: string;
  date: string | null;
};

interface Props {
  isOpen: boolean;
  onClose: () => void;
  selectedMeetings: string[];
  onSelectMeetings: (meetingIds: string[]) => void;
}

export default function MeetingSelectorModal({
  isOpen,
  onClose,
  selectedMeetings,
  onSelectMeetings,
}: Props) {
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [selected, setSelected] = useState<Set<string>>(
    new Set(selectedMeetings)
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // New states
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState<
    "newest" | "oldest" | "alphabetical"
  >("newest");
  const [showSortOptions, setShowSortOptions] = useState(false);

  // Reset search when modal opens
  useEffect(() => {
    if (isOpen) {
      setSearchQuery("");
    }
  }, [isOpen]);

  // Reset selected meetings when modal opens to sync with parent component
  useEffect(() => {
    setSelected(new Set(selectedMeetings));
  }, [selectedMeetings, isOpen]);

  // Fetch meetings when modal opens
  useEffect(() => {
    const fetchMeetings = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await fetch("/api/meetings");

        if (!response.ok) {
          throw new Error("Failed to fetch meetings");
        }

        const data = await response.json();
        if (!Array.isArray(data)) {
          throw new Error("Invalid response format");
        }

        setMeetings(data);
      } catch (error) {
        console.error("Error fetching meetings:", error);
        toast.error("Failed to load meetings");
        setError(error instanceof Error ? error.message : "An unknown error occurred");
        setMeetings([]);
      } finally {
        setIsLoading(false);
      }
    };

    if (isOpen) {
      fetchMeetings();
    }
  }, [isOpen]);

  // Filter and sort the meetings
  const filteredAndSortedMeetings = useMemo(() => {
    let result = [...meetings];

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter((meeting) =>
        meeting.title.toLowerCase().includes(query)
      );
    }

    // Sort meetings
    result.sort((a, b) => {
      switch (sortOrder) {
        case "newest":
          return a.date && b.date
            ? new Date(b.date).getTime() - new Date(a.date).getTime()
            : 0;
        case "oldest":
          return a.date && b.date
            ? new Date(a.date).getTime() - new Date(b.date).getTime()
            : 0;
        case "alphabetical":
          return a.title.localeCompare(b.title);
        default:
          return 0;
      }
    });

    return result;
  }, [meetings, searchQuery, sortOrder]);

  const handleSave = () => {
    const selectedIds = Array.from(selected);
    if (selectedIds.length === 0) {
      toast.error("Please select at least one meeting");
      return;
    }
    onSelectMeetings(selectedIds);
    onClose();
  };

  const toggleSelectAll = () => {
    if (filteredAndSortedMeetings.length > 0) {
      if (
        filteredAndSortedMeetings.every((meeting) => selected.has(meeting.id))
      ) {
        // If all filtered meetings are selected, deselect them
        const newSelected = new Set(selected);
        filteredAndSortedMeetings.forEach((meeting) => {
          newSelected.delete(meeting.id);
        });
        setSelected(newSelected);
      } else {
        // Otherwise, select all filtered meetings
        const newSelected = new Set(selected);
        filteredAndSortedMeetings.forEach((meeting) => {
          newSelected.add(meeting.id);
        });
        setSelected(newSelected);
      }
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "No date";

    const date = new Date(dateString);
    const now = new Date();
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);

    // Today
    if (date.toDateString() === now.toDateString()) {
      return `Today at ${date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })}`;
    }
    // Yesterday
    else if (date.toDateString() === yesterday.toDateString()) {
      return `Yesterday at ${date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })}`;
    }
    // This week (within 7 days)
    else if (now.getTime() - date.getTime() < 7 * 24 * 60 * 60 * 1000) {
      return `${date.toLocaleDateString([], {
        weekday: "long",
      })} at ${date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })}`;
    }
    // Default date format
    else {
      return date.toLocaleDateString([], {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    }
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog onClose={onClose} className="relative z-50">
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm"
            aria-hidden="true"
          />
        </Transition.Child>

        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <Dialog.Panel className="w-full max-w-xl bg-white dark:bg-gray-800 rounded-xl shadow-xl overflow-hidden transform transition-all">
              <div className="flex items-center justify-between p-4 border-b dark:border-gray-700">
                <Dialog.Title className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  Select Meetings
                </Dialog.Title>
                <button
                  onClick={onClose}
                  className="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                </button>
              </div>

              {/* Search and Filter Section */}
              <div className="p-3 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/70">
                <div className="flex gap-2 flex-wrap sm:flex-nowrap">
                  <div className="relative flex-1">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Search className="h-4 w-4 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search meetings..."
                      className="block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 py-2 pl-10 pr-3 text-sm text-gray-900 dark:text-gray-100 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                    {searchQuery && (
                      <button
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                        onClick={() => setSearchQuery("")}
                      >
                        <X className="h-4 w-4 text-gray-400 hover:text-gray-500" />
                      </button>
                    )}
                  </div>
                  <div className="relative">
                    <button
                      className="py-2 px-3 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600 flex items-center gap-1.5"
                      onClick={() => setShowSortOptions(!showSortOptions)}
                    >
                      <Clock className="w-4 h-4" />
                      <span>Sort</span>
                      <ChevronDown className="w-3.5 h-3.5 opacity-70" />
                    </button>

                    {showSortOptions && (
                      <div className="absolute right-0 z-10 mt-1 w-48 origin-top-right rounded-md bg-white dark:bg-gray-700 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                        <div className="py-1">
                          {[
                            {
                              id: "newest",
                              label: "Newest first",
                              icon: <Calendar className="w-4 h-4" />,
                            },
                            {
                              id: "oldest",
                              label: "Oldest first",
                              icon: <Calendar className="w-4 h-4" />,
                            },
                            {
                              id: "alphabetical",
                              label: "Alphabetical",
                              icon: <Tag className="w-4 h-4" />,
                            },
                          ].map((option) => (
                            <button
                              key={option.id}
                              className={`flex items-center w-full px-4 py-2 text-sm ${
                                sortOrder === option.id
                                  ? "bg-gray-100 dark:bg-gray-600 text-gray-900 dark:text-white"
                                  : "text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600"
                              }`}
                              onClick={() => {
                                setSortOrder(option.id as any);
                                setShowSortOptions(false);
                              }}
                            >
                              <span className="w-5 mr-2 inline-flex justify-center">
                                {option.icon}
                              </span>
                              {option.label}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="max-h-[60vh] overflow-y-auto">
                {isLoading ? (
                  <div className="flex flex-col items-center justify-center py-8">
                    <Loader2 className="w-6 h-6 text-blue-500 animate-spin mb-2" />
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Loading meetings...
                    </p>
                  </div>
                ) : error ? (
                  <div className="text-center py-6">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/20 mb-3">
                      <X className="w-6 h-6 text-red-500" />
                    </div>
                    <p className="text-red-500 font-medium">{error}</p>
                    <button
                      className="mt-3 text-sm text-blue-500 hover:underline"
                      onClick={() => {
                        setIsLoading(true);
                        fetch("/api/meetings")
                          .then((res) => res.json())
                          .then((data) => {
                            setMeetings(data);
                            setError(null);
                          })
                          .catch((err) => setError(err.message))
                          .finally(() => setIsLoading(false));
                      }}
                    >
                      Retry
                    </button>
                  </div>
                ) : meetings.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-700 mb-3">
                      <svg
                        className="w-6 h-6 text-gray-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                        />
                      </svg>
                    </div>
                    <p className="text-gray-500 dark:text-gray-400">
                      No meetings found
                    </p>
                  </div>
                ) : (
                  <div className="p-1">
                    {/* Select all row */}
                    {filteredAndSortedMeetings.length > 0 && (
                      <div className="flex items-center px-3 py-2 mx-1 bg-gray-50 dark:bg-gray-700/40 rounded-md mb-1 sticky top-0 z-10 shadow-sm">
                        <button
                          onClick={toggleSelectAll}
                          className="flex items-center gap-2 text-sm text-blue-600 dark:text-blue-400 hover:underline"
                        >
                          {filteredAndSortedMeetings.every((meeting) =>
                            selected.has(meeting.id)
                          )
                            ? "Deselect all"
                            : "Select all"}
                        </button>
                        <div className="ml-auto text-xs text-gray-500">
                          {selected.size} selected
                        </div>
                      </div>
                    )}

                    {/* Filtered results message */}
                    {searchQuery && filteredAndSortedMeetings.length === 0 ? (
                      <div className="py-6 text-center">
                        <p className="text-gray-500 dark:text-gray-400">
                          No meetings match your search
                        </p>
                      </div>
                    ) : searchQuery ? (
                      <div className="px-4 py-1.5 text-xs text-gray-500 dark:text-gray-400">
                        Found {filteredAndSortedMeetings.length}{" "}
                        {filteredAndSortedMeetings.length === 1
                          ? "meeting"
                          : "meetings"}{" "}
                        matching "{searchQuery}"
                      </div>
                    ) : null}

                    {/* Meeting list */}
                    <div className="p-2 space-y-1.5">
                      {filteredAndSortedMeetings.map((meeting) => (
                        <div
                          key={meeting.id}
                          className={`flex items-center p-3 rounded-lg transition-all duration-150 cursor-pointer
                          ${
                            selected.has(meeting.id)
                              ? "bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-900/50"
                              : "hover:bg-gray-50 dark:hover:bg-gray-700/50 border border-transparent"
                          }`}
                          onClick={() => {
                            const newSelected = new Set(selected);
                            if (selected.has(meeting.id)) {
                              newSelected.delete(meeting.id);
                            } else {
                              newSelected.add(meeting.id);
                            }
                            setSelected(newSelected);
                          }}
                        >
                          <div
                            className={`flex-shrink-0 w-5 h-5 rounded-md border flex items-center justify-center mr-3 transition-all 
                            ${
                              selected.has(meeting.id)
                                ? "bg-blue-500 border-blue-500"
                                : "border-gray-300 dark:border-gray-600"
                            }`}
                          >
                            {selected.has(meeting.id) && (
                              <Check className="w-3 h-3 text-white" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                              {meeting.title}
                            </div>
                            {meeting.date && (
                              <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1.5 mt-0.5">
                                <Calendar className="w-3 h-3 flex-shrink-0" />
                                {formatDate(meeting.date)}
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="p-4 border-t dark:border-gray-700 flex flex-col sm:flex-row sm:justify-between gap-3 bg-gray-50 dark:bg-gray-800/70">
                <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                  {meetings.length > 0 && (
                    <>
                      <span className="font-medium text-gray-900 dark:text-gray-200">
                        {selected.size}
                      </span>
                      <span className="ml-1">
                        of {meetings.length} meetings selected
                      </span>
                    </>
                  )}
                </div>
                <div className="flex justify-end gap-2">
                  <button
                    onClick={onClose}
                    className="px-4 py-2 text-sm rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    className="px-4 py-2 text-sm bg-blue-500 text-white rounded-lg hover:bg-blue-600 active:bg-blue-700 transition-colors font-medium shadow-sm disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center min-w-[90px]"
                    disabled={selected.size === 0 || isLoading}
                  >
                    {isLoading ? (
                      <span className="flex items-center">
                        <Loader2 className="w-3 h-3 animate-spin mr-2" />
                        Processing...
                      </span>
                    ) : (
                      "Apply"
                    )}
                  </button>
                </div>
              </div>
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
}
