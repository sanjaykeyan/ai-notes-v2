"use client";

import { useState, useEffect } from "react";
import { Dialog } from "@headlessui/react";
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
      const formData = new FormData();
      formData.append("file", file);
      formData.append("title", title);

      // Start the upload
      const response = await fetch("/api/meetings/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Upload failed");

      setPhase("processing");

      // Handle SSE response
      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      while (reader) {
        const { done, value } = await reader.read();
        if (done) break;

        const text = decoder.decode(value);
        const lines = text.split('\n');
        
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.slice(5));
              if (data.status === 'complete') {
                // Show completion toast
                toast.success(
                  'Meeting processing complete! View it in Recent Meetings.',
                  {
                    duration: 5000,
                    position: 'bottom-center',
                    style: {
                      background: '#F0FDF4',
                      color: '#166534',
                      border: '1px solid #BBF7D0'
                    },
                  }
                );
                
                // Dispatch event for meeting processed
                window.dispatchEvent(new CustomEvent('meetingProcessed', {
                  detail: data.meeting
                }));
                // Add both toast and notification
                toast.success('Meeting processing complete!');
                addNotification('Your meeting recording has been processed successfully.');
                handleClose(); // Close modal after successful processing
              }
            } catch (e) {
              console.error('Error parsing SSE data:', e);
            }
          }
        }
      }

      router.refresh();
    } catch (error) {
      console.error("Upload error:", error);
    } finally {
      setLoading(false);
      setProgress(0);
    }
  };

  return (
    <Dialog open={isOpen} onClose={handleClose} className="relative z-50">
      <div
        className="fixed inset-0 bg-black/30 backdrop-blur-sm"
        aria-hidden="true"
      />

      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="mx-auto max-w-sm md:max-w-md w-full rounded-2xl bg-white p-6 shadow-xl relative">
          {/* Close button - always visible */}
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>

          {phase === "processing" ? (
            <div className="space-y-4">
              <Dialog.Title className="text-xl font-semibold">
                Processing in Background
              </Dialog.Title>
              <p className="text-gray-600">
                Your meeting is being processed. You can safely close this window - 
                we'll send you an email when processing is complete.
              </p>
              <div className="flex justify-end">
                <button
                  onClick={handleClose}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
                >
                  Close Window
                </button>
              </div>
            </div>
          ) : (
            <>
              <Dialog.Title className="text-xl font-semibold mb-4">
                Upload Meeting Recording
              </Dialog.Title>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Meeting Title
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Recording File
                  </label>
                  <div className="flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-lg">
                    <div className="space-y-1 text-center">
                      <svg
                        className="mx-auto h-12 w-12 text-gray-400"
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
                      <div className="flex text-sm text-gray-600">
                        <label className="relative cursor-pointer rounded-md font-medium text-blue-600 hover:text-blue-500">
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
                      <p className="text-xs text-gray-500">MP3, MP4 up to 500MB</p>
                    </div>
                  </div>
                  {file && (
                    <p className="text-sm text-gray-500">Selected: {file.name}</p>
                  )}
                </div>

                {loading && (
                  <div className="space-y-2">
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div
                        className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                    <p className="text-sm text-gray-500 text-center">
                      {phase === "uploading" ? "Uploading..." : "Processing..."}
                    </p>
                  </div>
                )}

                <div className="flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={handleClose}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading || !file || !title}
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50"
                  >
                    Upload
                  </button>
                </div>
              </form>
            </>
          )}
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}
