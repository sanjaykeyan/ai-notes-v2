import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import DashboardSidebar from "@/components/DashboardSidebar";
import DashboardTopbar from "@/components/DashboardTopbar";
import MeetingsContent from "./MeetingsContent";

export default async function MeetingsPage() {
  const { userId } = await auth();
  const user = await currentUser();

  if (!userId) {
    redirect("/auth/sign-in");
  }

  const folders = await prisma.folder.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });

  const meetings = await prisma.meeting.findMany({
    where: {
      userId,
    },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      title: true,
      createdAt: true,
      duration: true,
      folderId: true,
      isLiveRecorded: true, // Add this field
    },
  });

  return (
    <div className="flex h-screen overflow-hidden bg-[#f8f9fa] dark:bg-gray-900">
      <DashboardSidebar />
      <div
        className="flex-1 flex flex-col overflow-hidden"
        style={{ marginLeft: "var(--sidebar-width)" }}
      >
        <DashboardTopbar />
        <MeetingsContent meetings={meetings} folders={folders} />
      </div>
    </div>
  );
}
