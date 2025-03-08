import { useState, useEffect } from "react";
import { Dialog } from "@headlessui/react";
import { X, Check } from "lucide-react";

type Meeting = {
  id: string;
  title: string;
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

  useEffect(() => {
    fetch("/api/meetings")
      .then((res) => res.json())
      .then((data) => setMeetings(data));
  }, []);

  const handleSave = () => {
    onSelectMeetings(Array.from(selected));
    onClose();
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="w-full max-w-md bg-white dark:bg-gray-800 rounded-xl shadow-xl">
          <div className="flex items-center justify-between p-4 border-b dark:border-gray-700">
            <Dialog.Title className="text-lg font-medium">
              Select Meetings
            </Dialog.Title>
            <button
              onClick={onClose}
              className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-4 max-h-[60vh] overflow-y-auto">
            {meetings.map((meeting) => (
              <div
                key={meeting.id}
                className="flex items-center p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer"
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
                  className={`w-5 h-5 rounded border flex items-center justify-center mr-3 
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
                {meeting.title}
              </div>
            ))}
          </div>

          <div className="p-4 border-t dark:border-gray-700 flex justify-end gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 text-sm bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              Apply
            </button>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}
