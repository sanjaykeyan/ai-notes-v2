'use client'

import { Dialog } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function HelpModal({ isOpen, onClose }: HelpModalProps) {
  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" aria-hidden="true" />

      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="mx-auto w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl">
          <div className="flex justify-between items-center mb-4">
            <Dialog.Title className="text-lg font-semibold">
              How it works
            </Dialog.Title>
            <button
              onClick={onClose}
              className="p-1 rounded-lg hover:bg-gray-100"
            >
              <XMarkIcon className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          <div className="space-y-4">
            {[
              {
                title: "Upload Recording",
                description: "Upload your meeting recording",
                icon: "📤",
                color: "from-blue-500 to-blue-600",
              },
              {
                title: "AI Processing",
                description: "AI transcribes and summarizes",
                icon: "🤖",
                color: "from-purple-500 to-purple-600",
              },
              {
                title: "Review & Share",
                description: "Get and share your notes",
                icon: "✨",
                color: "from-indigo-500 to-indigo-600",
              },
            ].map((item, index) => (
              <div key={item.title} className="flex items-center space-x-4">
                <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${item.color} flex items-center justify-center shrink-0`}>
                  <span className="text-lg">{item.icon}</span>
                </div>
                <div>
                  <h3 className="text-sm font-semibold">{item.title}</h3>
                  <p className="text-xs text-gray-600">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}
