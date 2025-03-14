"use client";
import { useState } from "react";
import Link from "next/link";
import * as Icons from "lucide-react";
import { LucideProps } from "lucide-react";
import RecordingPopup from "./RecordingPopup";
import UploadMeetingModal from "./upload-meeting-modal";

interface Props {
  iconName: keyof typeof Icons;
  label: string;
  href: string;
  id?: string;
  dataType?: string;
  beta?: boolean;
  wip?: boolean;
  iconColor?: string;
}

export default function DashboardButton({
  iconName,
  label,
  href,
  id,
  dataType,
  beta,
  wip,
  iconColor,
}: Props) {
  const [isRecordingPopupOpen, setIsRecordingPopupOpen] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const Icon = Icons[iconName] as React.ComponentType<LucideProps>;

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();

    switch (href) {
      case "/online-meets":
        setIsRecordingPopupOpen(true);
        break;
      case "/upload":
        setIsUploadModalOpen(true);
        break;
      case "/record":
        window.location.href = href;
        break;
      case "/meeting-bot":
        // For now, just navigate since it's in beta/WIP
        window.location.href = href;
        break;
      default:
        window.location.href = href;
    }
  };

  const button = (
    <div
      onClick={handleClick}
      className="relative group flex flex-col items-center justify-center gap-3 p-6 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 hover:shadow-md transition-all duration-200 cursor-pointer"
    >
      <div
        className={`w-12 h-12 rounded-full bg-gray-50 dark:bg-gray-700 flex items-center justify-center ${
          iconColor || "text-gray-500"
        }`}
      >
        <Icon className="w-6 h-6" />
      </div>
      <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
        {label}
      </span>
      {beta && (
        <span className="absolute top-2 right-2 px-1.5 py-0.5 text-[10px] font-medium bg-blue-100 text-blue-600 rounded">
          BETA
        </span>
      )}
      {wip && (
        <span className="absolute top-2 right-2 px-1.5 py-0.5 text-[10px] font-medium bg-yellow-100 text-yellow-600 rounded">
          WIP
        </span>
      )}
    </div>
  );

  return (
    <>
      <div id={id} data-type={dataType}>
        {button}
      </div>

      {/* Recording Popup Modal */}
      <RecordingPopup
        isOpen={isRecordingPopupOpen}
        onClose={() => setIsRecordingPopupOpen(false)}
      />

      {/* Upload Meeting Modal */}
      <UploadMeetingModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onProcessingStart={() => {}}
        onProcessingEnd={() => {}}
      />
    </>
  );
}
