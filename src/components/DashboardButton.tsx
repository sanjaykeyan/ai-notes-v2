"use client";

import {
  Upload,
  Video,
  Mic,
  MonitorUp,
  Calendar,
  Bot,
  LucideIcon,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import UploadMeetingModal from "./upload-meeting-modal";

const IconMap = {
  Upload,
  Video,
  Mic,
  MonitorUp,
  Calendar,
  Bot,
} as const;

type IconName = keyof typeof IconMap;

interface DashboardButtonProps {
  iconName: IconName;
  label: string;
  href: string;
  id?: string;
  dataType?: string;
  iconColor?: string;
  beta?: boolean;
}

export default function DashboardButton({
  iconName,
  label,
  href,
  id,
  dataType,
  iconColor,
  beta,
}: DashboardButtonProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const Icon = IconMap[iconName];

  if (dataType === "upload") {
    return (
      <>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex flex-col items-center gap-3 p-4 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-500 transition-colors"
          id={id}
          data-type={dataType}
        >
          <div className={`p-3 rounded-lg ${iconColor}`}>
            <Icon className="w-6 h-6" />
          </div>
          <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
            {label}
          </span>
        </button>

        <UploadMeetingModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onProcessingStart={() => setIsProcessing(true)}
          onProcessingEnd={() => setIsProcessing(false)}
        />
      </>
    );
  }

  return (
    <Link
      href={href}
      className="flex flex-col items-center gap-3 p-4 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-500 transition-colors"
      id={id}
      data-type={dataType}
    >
      <div className={`p-3 rounded-lg ${iconColor}`}>
        <Icon className="w-6 h-6" />
      </div>
      <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
        {label}
        {beta && (
          <span className="ml-1 px-1.5 py-0.5 text-[10px] font-medium bg-blue-100 text-blue-600 rounded">
            BETA
          </span>
        )}
      </span>
    </Link>
  );
}
