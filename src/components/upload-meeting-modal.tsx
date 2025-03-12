"use client";

import { useState, useEffect, Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { useRouter } from "next/navigation";
import { XMarkIcon } from "@heroicons/react/24/outline";
import toast from "react-hot-toast";
import { useNotifications } from '@/contexts/NotificationContext';

interface UploadMeetingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProcessingStart: () => void;
  onProcessingEnd: () => void;
}

export default function UploadMeetingModal({
  isOpen,
  onClose,
  onProcessingStart,
  onProcessingEnd,
}: UploadMeetingModalProps) {
  const router = useRouter();
  const { addNotification } = useNotifications();
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState<"idle" | "uploading" | "processing">("idle");
  const [uploadStarted, setUploadStarted] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      // Reset all states when modal closes
      setPhase("idle");
      setFile(null);
      setTitle("");
      setLoading(false);
      setProgress(0);
      setUploadStarted(false);
    }
  }, [isOpen]);

  const handleClose = () => {
    // Reset states and close modal
    setPhase("idle");
    setFile(null);
    setTitle("");
    setLoading(false);
    setProgress(0);
    setUploadStarted(false);
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !title) return;

    try {
      setLoading(true);
      setPhase("uploading");
      setUploadStarted(true);
      
      // Upload simulation for progress bar
      for (let i = 0; i <= 100; i += 10) {
        setProgress(i);
        await new Promise((resolve) => setTimeout(resolve, 500));
      }

      setPhase("processing");
      const processFormData = new FormData();
      processFormData.append("file", file);
      processFormData.append("title", title);
  
      const processResponse = await fetch("/api/process-audio", {
        method: "POST",
        body: processFormData,
      });
  
      if (!processResponse.ok) {
        throw new Error(`Audio processing failed: ${processResponse.statusText}`);
      }
  
      const processResult = await processResponse.json();
  
      const meetingData = new FormData();
      meetingData.append("file", file); // Include the original file
      meetingData.append("title", title);
      meetingData.append("transcription", processResult.transcription);
      meetingData.append("summary", processResult.summary);
      meetingData.append("timestamp_mapping", processResult.timestamp_mapping);
      meetingData.append("duration", processResult.duration);
  
      const uploadResponse = await fetch("/api/meetings/upload", {
        method: "POST",
        body: meetingData,
      });
  
      if (!uploadResponse.ok) {
        const errorText = await uploadResponse.text();
        throw new Error(`Meeting creation failed: ${uploadResponse.statusText} - ${errorText}`);
      }
  
      const meeting = await uploadResponse.json();
  
      toast.success('Meeting processing complete! View it in Recent Meetings.', {
        duration: 5000,
        position: 'bottom-center',
        style: {
          background: '#F0FDF4',
          color: '#166534',
          border: '1px solid #BBF7D0'
        },
      });
      addNotification('Your meeting recording has been processed successfully.');
      handleClose();
      router.refresh();
    } catch (error) {
      console.error("Upload error:", error instanceof Error ? { message: error.message, stack: error.stack } : error);
      toast.error("Failed to process meeting recording");
    } finally {
      setLoading(false);
      setProgress(0);
    }
  };
      

  return (
    <Transition show={isOpen} as={Fragment}>
      <Dialog onClose={handleClose} className="relative z-50">
        {/* Backdrop */}
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-200"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-150"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" />
        </Transition.Child>

        {/* Modal container - Removed overflow-y-auto to prevent scroll interference */}
        <div className="fixed inset-0">
          <div className="flex min-h-full items-end sm:items-center justify-center">
            <Transition.Child
              as={Fragment}
              enter="transform transition ease-out duration-200"
              enterFrom="translate-y-full sm:translate-y-0 sm:scale-95 sm:opacity-0"
              enterTo="translate-y-0 sm:scale-100 sm:opacity-100"
              leave="transform transition ease-in duration-150"
              leaveFrom="translate-y-0 sm:scale-100 sm:opacity-100"
              leaveTo="translate-y-full sm:translate-y-0 sm:scale-95 sm:opacity-0"
            >
              <Dialog.Panel className="w-full sm:max-w-sm rounded-t-2xl sm:rounded-2xl bg-white dark:bg-gray-800 p-4 sm:p-6 shadow-xl relative">
                {phase === "processing" ? (
                  // Processing view
                  <div className="space-y-3 py-2 animate-fadeIn">
                    <Dialog.Title className="text-lg font-semibold dark:text-white">
                      Processing in Background
                    </Dialog.Title>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      Your meeting is being processed. You'll receive a notification when it's ready.
                    </p>
                    <div className="flex justify-end">
                      <button
                        onClick={handleClose}
                        className="px-3 py-1.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
                      >
                        Close
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <Dialog.Title className="text-lg font-semibold mb-3 dark:text-white">
                      Upload Meeting
                    </Dialog.Title>

                    <form onSubmit={handleSubmit} className="space-y-3">
                      {/* Mobile-optimized form fields */}
                      <div>
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          Meeting Title
                        </label>
                        <input
                          type="text"
                          value={title}
                          onChange={(e) => setTitle(e.target.value)}
                          className="mt-1 w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                          required
                        />
                      </div>

                      {/* Compact file upload area */}
                      <div className="space-y-1">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          Recording File
                        </label>
                        <div className="flex justify-center px-4 py-3 border-2 border-dashed rounded-lg dark:border-gray-600">
                          <div className="space-y-1 text-center">
                            <svg
                              className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500"
                              stroke="currentColor"
                              fill="none"
                              viewBox="0 0 48 48"
                            >
                              <path
                                d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                                strokeWidth={2}
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                            <div className="flex text-sm text-gray-600 dark:text-gray-400">
                              <label className="relative cursor-pointer rounded-md font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300">
                                <span>Upload a file</span>
                                <input
                                  type="file"
                                  className="sr-only"
                                  accept="audio/*,video/*"
                                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                                />
                              </label>
                              <p className="pl-1">or drag and drop</p>
                            </div>
                            <p className="text-xs text-gray-500 dark:text-gray-400">MP3, MP4 up to 500MB</p>
                          </div>
                        </div>
                        {file && (
                          <p className="text-sm text-gray-500 dark:text-gray-400">Selected: {file.name}</p>
                        )}
                      </div>

                      {/* Progress indicators with animation */}
                      {loading && (
                        <div className="space-y-2 animate-fadeIn">
                          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 overflow-hidden">
                            <div
                              className="bg-blue-600 dark:bg-blue-500 h-2.5 rounded-full transition-all duration-300 ease-out"
                              style={{ width: `${progress}%` }}
                            />
                          </div>
                          <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
                            {phase === "uploading" ? "Uploading..." : "Processing..."}
                          </p>
                        </div>
                      )}

                      {/* Mobile-optimized buttons */}
                      <div className="flex gap-2 pt-2">
                        <button
                          type="button"
                          onClick={handleClose}
                          className="flex-1 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          disabled={loading || !file || !title}
                          className="flex-1 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 dark:bg-blue-500 dark:hover:bg-blue-600"
                        >
                          Upload
                        </button>
                      </div>
                    </form>
                  </>
                )}
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
