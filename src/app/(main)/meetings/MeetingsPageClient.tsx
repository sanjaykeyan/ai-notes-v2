"use client";

import { useState } from "react";
import CreateFolderModal from "@/components/CreateFolderModal";

export default function MeetingsPageClient({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isCreateFolderModalOpen, setIsCreateFolderModalOpen] = useState(false);

  return (
    <>
      {children}
      <CreateFolderModal
        isOpen={isCreateFolderModalOpen}
        onClose={() => setIsCreateFolderModalOpen(false)}
      />
    </>
  );
}
