"use client";
import { useState } from "react";
import { Dialog } from "@headlessui/react";
import { X } from "lucide-react";
import ScreenRecorder from "./ScreenRecorder";
import RecordingModal from "./recording-modal";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function RecordingPopup({ isOpen, onClose }: Props) {
  const [isProcessingModal, setIsProcessingModal] = useState(false);
  const [recordedAudio, setRecordedAudio] = useState<Blob | null>(null);

  const handleRecordingComplete = (audioBlob: Blob) => {
    setRecordedAudio(audioBlob);
    setIsProcessingModal(true);
  };

  const handleProcessingModalClose = () => {
    setIsProcessingModal(false);
    setRecordedAudio(null);
    onClose();
  };

  return (
    <>
      <Dialog open={isOpen} onClose={onClose} className="relative z-50">
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="mx-auto max-w-2xl w-full bg-white dark:bg-gray-800 rounded-2xl shadow-xl">
            <div className="relative">
              <button
                onClick={onClose}
                className="absolute right-4 top-4 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="p-6">
                <Dialog.Title className="text-xl font-semibold mb-4">
                  Record Online Meeting
                </Dialog.Title>
                <ScreenRecorder onRecordingComplete={handleRecordingComplete} />
              </div>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>

      <RecordingModal
        isOpen={isProcessingModal}
        onClose={handleProcessingModalClose}
        recordedAudio={recordedAudio}
        onProcessingStart={() => {}}
        onProcessingEnd={handleProcessingModalClose}
      />
    </>
  );
}
