"use client";

import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { FolderIcon } from "lucide-react";

interface MoveMeetingsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  folders: { id: string; name: string }[];
  onMove: (folderId: string | null) => void;
}

export default function MoveMeetingsDialog({
  isOpen,
  onClose,
  folders,
  onMove,
}: MoveMeetingsDialogProps) {
  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
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

        <div className="fixed inset-0 overflow-y-auto">
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
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white dark:bg-gray-800 shadow-xl transition-all border border-gray-200 dark:border-gray-700">
                <div className="p-6">
                  <Dialog.Title className="text-xl font-semibold mb-1 text-gray-900 dark:text-gray-100">
                    Move to Folder
                  </Dialog.Title>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                    Select a destination folder for your selected items
                  </p>
                </div>

                <div className="px-2 pb-4 max-h-[300px] overflow-y-auto">
                  <div className="space-y-1">
                    {folders.map((folder) => (
                      <button
                        key={folder.id}
                        onClick={() => onMove(folder.id)}
                        className="w-full text-left px-4 py-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 flex items-center gap-3 group transition-colors duration-200"
                      >
                        <FolderIcon className="w-5 h-5 text-gray-400 group-hover:text-blue-500 transition-colors duration-200" />
                        <span className="font-medium group-hover:text-blue-500">
                          {folder.name}
                        </span>
                      </button>
                    ))}
                    <button
                      onClick={() => onMove(null)}
                      className="w-full text-left px-4 py-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 flex items-center gap-3 group transition-colors duration-200"
                    >
                      <svg
                        className="w-5 h-5 text-gray-400 group-hover:text-blue-500 transition-colors duration-200"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5m6 4.125l2.25 2.25m0 0l2.25 2.25M12 13.875l2.25-2.25M12 13.875l-2.25 2.25M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z"
                        />
                      </svg>
                      <span className="font-medium group-hover:text-blue-500">
                        Remove from folder
                      </span>
                    </button>
                  </div>
                </div>

                <div className="border-t border-gray-200 dark:border-gray-700 p-4 flex justify-end gap-2">
                  <button
                    onClick={onClose}
                    className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors duration-200"
                  >
                    Cancel
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
