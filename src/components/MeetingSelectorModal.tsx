import { useState, useEffect, Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { X, Check, Loader2 } from "lucide-react";
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
  const [error, setError] = useState(null);

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
        setError(error.message);
        setMeetings([]);
      } finally {
        setIsLoading(false);
      }
    };

    if (isOpen) {
      fetchMeetings();
    }
  }, [isOpen]);

  const handleSave = () => {
    const selectedIds = Array.from(selected);
    if (selectedIds.length === 0) {
      toast.error("Please select at least one meeting");
      return;
    }
    onSelectMeetings(selectedIds);
    onClose();
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
            <Dialog.Panel className="w-full max-w-md bg-white dark:bg-gray-800 rounded-xl shadow-xl overflow-hidden transform transition-all">
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

              <div className="p-4 max-h-[60vh] overflow-y-auto">
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
                  <div className="space-y-1">
                    {meetings.map((meeting) => (
                      <div
                        key={meeting.id}
                        className={`flex items-center p-3 rounded-lg transition-all duration-150 cursor-pointer
                        ${
                          selected.has(meeting.id)
                            ? "bg-blue-50 dark:bg-blue-900/20"
                            : "hover:bg-gray-50 dark:hover:bg-gray-700/50"
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
                          className={`w-5 h-5 rounded-md border flex items-center justify-center mr-3 transition-all 
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
                        <div className="flex-1">
                          <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                            {meeting.title}
                          </div>
                          {meeting.date && (
                            <div className="text-xs text-gray-500 dark:text-gray-400">
                              {new Date(meeting.date).toLocaleDateString()}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="p-4 border-t dark:border-gray-700 flex justify-end gap-2 bg-gray-50 dark:bg-gray-800/70">
                <button
                  onClick={onClose}
                  className="px-4 py-2 text-sm rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="px-4 py-2 text-sm bg-blue-500 text-white rounded-lg hover:bg-blue-600 active:bg-blue-700 transition-colors font-medium"
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
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
}
