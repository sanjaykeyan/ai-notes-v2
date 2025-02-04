"use client";
import { useState, useRef, useEffect } from 'react';
import { ShareIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';

interface ShareButtonProps {
  onShare: (method: ShareMethod) => void;
  className?: string;
  iconOnly?: boolean;
}

export type ShareMethod = 
  | 'whatsapp' 
  | 'email' 
  | 'linkedin' 
  | 'teams' 
  | 'slack' 
  | 'telegram' 
  | 'download';

const shareOptions = [
  {
    id: 'download',
    label: 'Download PDF',
    icon: '/images/sharing/pdf.svg',
    className: 'text-red-600'
  },
  {
    id: 'email',
    label: 'Email',
    icon: '/images/sharing/email.svg',
    className: 'text-blue-600'
  },
  {
    id: 'whatsapp',
    label: 'WhatsApp',
    icon: '/images/sharing/whatsapp.svg',
    className: 'text-green-600'
  },
  {
    id: 'linkedin',
    label: 'LinkedIn',
    icon: '/images/sharing/linkedin.svg',
    className: 'text-blue-700'
  },
  {
    id: 'teams',
    label: 'Microsoft Teams',
    icon: '/images/sharing/teams.svg',
    className: 'text-blue-500'
  },
  {
    id: 'slack',
    label: 'Slack',
    icon: '/images/sharing/slack.svg',
    className: 'text-purple-600'
  },
  {
    id: 'telegram',
    label: 'Telegram',
    icon: '/images/sharing/telegram.svg',
    className: 'text-blue-400'
  }
];

export function ShareButton({ onShare, className, iconOnly }: ShareButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });

  useEffect(() => {
    if (isOpen && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      
      setDropdownPosition({
        top: rect.bottom + 5, // Add small offset
        left: Math.max(0, rect.left - (dropdownRef.current?.offsetWidth || 0) + rect.width)
      });
    }
  }, [isOpen]);

  return (
    <div className="relative">
      <button
        ref={buttonRef}
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen(!isOpen);
        }}
        className={`flex items-center gap-2 ${
          iconOnly 
            ? 'p-1 text-gray-600 hover:text-blue-600 transition-colors duration-150' 
            : 'px-3 py-1.5 text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700'
        } ${className || ''}`}
      >
        <ShareIcon className={iconOnly ? "h-5 w-5" : "w-4 h-4"} />
        {!iconOnly && <span>Share</span>}
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-50"
            onClick={() => setIsOpen(false)}
          />
          <div
            ref={dropdownRef}
            className="absolute z-50"
            style={{
              top: `${dropdownPosition.top}px`,
              left: `${dropdownPosition.left}px`,
              transform: 'translateY(0)',
              position: 'fixed'
            }}
          >
            <div className="w-56 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-1">
              {shareOptions.map((option) => (
                <button
                  key={option.id}
                  onClick={() => {
                    onShare(option.id as ShareMethod);
                    setIsOpen(false);
                  }}
                  className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-150"
                >
                  <div className="w-5 h-5 relative flex-shrink-0">
                    <Image
                      src={option.icon}
                      alt={option.label}
                      fill
                      className="object-contain"
                    />
                  </div>
                  <span>{option.label}</span>
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
