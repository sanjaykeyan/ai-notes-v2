"use client";
import { useState } from 'react';
import { ShareIcon } from '@heroicons/react/24/outline';

interface ShareButtonProps {
  onShare: (method: 'whatsapp' | 'email' | 'download') => void;
}

export function ShareButton({ onShare }: ShareButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  const shareOptions = [
    { id: 'whatsapp', label: 'WhatsApp', icon: '📱' },
    { id: 'email', label: 'Email', icon: '📧' },
    { id: 'download', label: 'Download PDF', icon: '📥' },
  ];

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
      >
        <ShareIcon className="w-4 h-4" />
        Share
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-20">
            {shareOptions.map((option) => (
              <button
                key={option.id}
                onClick={() => {
                  onShare(option.id as 'whatsapp' | 'email' | 'download');
                  setIsOpen(false);
                }}
                className="flex items-center gap-3 w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 first:rounded-t-lg last:rounded-b-lg"
              >
                <span>{option.icon}</span>
                {option.label}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
