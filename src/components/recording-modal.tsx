"use client";
import { useState, useRef, Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useNotifications } from "@/contexts/NotificationContext";

interface RecordingModalProps {
  isOpen: boolean;
  onClose: () => void;
  recordedAudio: Blob | null;
  onProcessingStart: () => void;
  onProcessingEnd: () => void;
}

const RecordingModal = ({
  isOpen,
  onClose,
  recordedAudio,
  onProcessingStart,
  onProcessingEnd,
}: RecordingModalProps) => {
  const router = useRouter();
  const { addNotification } = useNotifications();
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioUrl = recordedAudio ? URL.createObjectURL(recordedAudio) : null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!recordedAudio || !title) return;

    try {
      setLoading(true);
      onProcessingStart();

      // Convert webm to mp3 using Media Source API
      const mediaSource = new MediaSource();
      const audioUrl = URL.createObjectURL(mediaSource);
      const audio = new Audio(audioUrl);

      // Create new blob with mp3 type
      const newAudioBlob = await fetch(URL.createObjectURL(recordedAudio))
        .then((r) => r.blob())
        .then((blob) => new Blob([blob], { type: "audio/mp3" }));

      const formData = new FormData();
      formData.append("file", newAudioBlob, "recorded-audio.mp3");
      formData.append("title", title);

      console.log("Sending file:", {
        size: newAudioBlob.size,
        type: newAudioBlob.type,
      });

      const response = await fetch("/api/meetings/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Upload error response:", errorText);
        throw new Error("Failed to process recording");
      }

      toast.success("Meeting processing complete!");
      addNotification(
        "Your meeting recording has been processed successfully."
      );
      onClose();
      onProcessingEnd();
    } catch (error) {
      console.error("Processing error:", error);
      toast.error("Failed to process recording");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Transition show={isOpen} as={Fragment}>
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
          <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
                <Dialog.Title className="text-lg font-semibold mb-4">
                  Save Recording
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

                  {audioUrl && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Preview Recording
                      </label>
                      <audio
                        ref={audioRef}
                        src={audioUrl}
                        controls
                        className="w-full"
                      />
                    </div>
                  )}

                  <div className="flex justify-end space-x-3 pt-4">
                    <button
                      type="button"
                      onClick={onClose}
                      className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={loading || !title}
                      className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50"
                    >
                      {loading ? "Processing..." : "Save"}
                    </button>
                  </div>
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default RecordingModal;
