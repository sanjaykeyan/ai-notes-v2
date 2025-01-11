"use client";

import { useState } from "react";
import { Dialog } from "@headlessui/react";
import { useRouter } from "next/navigation";

interface UploadTranscriptModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function UploadTranscriptModal({
  isOpen,
  onClose,
}: UploadTranscriptModalProps) {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [transcript, setTranscript] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!transcript || !title) return;

    try {
      setLoading(true);
      setError(null);

      console.log("Submitting transcript:", {
        titleLength: title.length,
        transcriptLength: transcript.length,
      });

      const response = await fetch("/api/meetings/upload-transcript", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: title.trim(),
          transcript: transcript.trim(),
        }),
      });

      let data;
      try {
        data = await response.json();
      } catch (e) {
        console.error("Response parsing error:", e);
        throw new Error("Invalid server response");
      }

      if (!response.ok) {
        console.error("Server error response:", data);
        throw new Error(
          data.error || data.details || "Failed to upload transcript"
        );
      }

      console.log("Upload successful:", data);
      router.refresh();
      onClose();
      setTitle("");
      setTranscript("");
    } catch (error) {
      console.error("Upload error:", error);
      setError(
        error instanceof Error ? error.message : "Failed to upload transcript"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div
        className="fixed inset-0 bg-black/30 backdrop-blur-sm"
        aria-hidden="true"
      />

      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="mx-auto max-w-lg w-full rounded-2xl bg-white p-6 shadow-xl">
          <Dialog.Title className="text-xl font-semibold mb-4">
            Upload Meeting Transcript
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

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Transcript
              </label>
              <textarea
                value={transcript}
                onChange={(e) => setTranscript(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 min-h-[200px]"
                required
                placeholder="Paste your meeting transcript here..."
              />
            </div>

            {error && (
              <div className="text-red-500 text-sm rounded-lg bg-red-50 p-3">
                {error}
              </div>
            )}

            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading || !transcript || !title}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    <span>Uploading...</span>
                  </>
                ) : (
                  "Upload"
                )}
              </button>
            </div>
          </form>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}
