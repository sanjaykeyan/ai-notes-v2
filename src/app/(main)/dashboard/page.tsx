import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { isNewUser } from "@/lib/user-utils";
import Link from "next/link";
import {
  Upload,
  Video,
  Mic,
  MonitorUp,
  Calendar,
  VideoIcon,
} from "lucide-react";
import DashboardButton from "@/components/DashboardButton";
import DeleteMeetingButton from "@/components/DeleteMeetingButton";
import DashboardSidebar from "@/components/DashboardSidebar";
import DashboardTopbar from "@/components/DashboardTopbar";
import MyRecordsSection from "@/components/MyRecordsSection";

export default async function Dashboard() {
  const { userId } = await auth();
  const user = await currentUser();

  if (!userId) {
    redirect("/auth/sign-in");
  }

  const [recentMeetings, totalMeetings] = await Promise.all([
    prisma.meeting.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        title: true,
        createdAt: true,
        isLiveRecorded: true,
        duration: true,
      },
      take: 10,
    }),
    prisma.meeting.count({
      where: { userId },
    }),
  ]);

  const firstName = user?.firstName || "there";
  const fullName = `${user?.firstName} ${user?.lastName}`.trim();

  return (
    <div className="flex h-screen overflow-hidden bg-[#f8f9fa] dark:bg-gray-900">
      <DashboardSidebar />

      <div
        className="flex-1 flex flex-col overflow-hidden"
        style={{ marginLeft: "calc(var(--sidebar-width) - 10px)" }}
      >
        <DashboardTopbar />

        <div className="flex-1 p-1 pl-0 overflow-hidden">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 h-full">
            {/* Main Content + Right Pane Container */}
            <div className="flex h-full overflow-hidden">
              {/* Main Content */}
              <div className="flex-1 flex flex-col overflow-hidden">
                {/* Header with quote */}
                <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                  <div className="flex items-center gap-2">
                    <span className="text-yellow-400">👋</span>
                    <h1
                      className="text-base font-medium text-gray-900 dark:text-gray-100"
                      style={{
                        fontFamily:
                          '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                      }}
                    >
                      Good morning, {fullName}
                    </h1>
                  </div>
                  <div
                    className="flex items-center gap-1 mt-1 text-xs text-gray-500 dark:text-gray-400"
                    style={{
                      fontFamily:
                        '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                    }}
                  >
                    <span className="text-gray-300">"</span>
                    <span>Plato</span>
                    <span className="mx-1">
                      Thinking: the talking of the soul with itself.
                    </span>
                    <span className="text-gray-300">"</span>
                  </div>
                </div>

                {/* Recording options */}
                <div className="p-4">
                  <div className="grid grid-cols-4 gap-3">
                    <DashboardButton
                      iconName="Mic"
                      label="Instant record"
                      href="/record"
                      id="newbie-guide-instant-btn"
                      dataType="instant"
                      iconColor="text-blue-500"
                    />
                    <DashboardButton
                      iconName="Upload"
                      label="Upload & transcribe"
                      href="/upload"
                      id="newbie-guide-upload-btn"
                      dataType="upload"
                      iconColor="text-green-500"
                    />
                    <DashboardButton
                      iconName="Video"
                      label="Record online meeting"
                      href="/online-meets"
                      id="newbie-guide-live-recording-btn"
                      dataType="meeting"
                      iconColor="text-rose-500"
                    />
                    <DashboardButton
                      iconName="Bot"
                      label="Send meeting bot"
                      href="/meeting-bot"
                      id="newbie-guide-meeting-bot-btn"
                      dataType="bot"
                      beta={true}
                      wip={true}
                      iconColor="text-orange-500"
                    />
                  </div>
                </div>

                {/* My Records Section */}
                <MyRecordsSection meetings={recentMeetings} />
              </div>

              {/* Right Pane - Events */}
              <div className="w-80 border-l border-gray-200 dark:border-gray-700 h-full flex flex-col">
                <div className="p-4 flex-1 overflow-auto">
                  <div className="flex items-center gap-2 mb-4 sticky top-0 bg-white dark:bg-gray-800 py-2">
                    <Calendar className="w-4 h-4 text-blue-500" />
                    <h2
                      className="text-sm font-medium text-gray-900 dark:text-gray-100"
                      style={{
                        fontFamily:
                          '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                      }}
                    >
                      Today's Events (0)
                    </h2>
                    <Link
                      href="/events"
                      className="text-xs text-blue-500 ml-auto hover:text-blue-600"
                    >
                      All events &gt;
                    </Link>
                  </div>

                  {/* Events List */}
                  <div className="space-y-3">
                    <div className="text-xs text-gray-500 dark:text-gray-400 text-center py-8">
                      No events scheduled for today
                    </div>
                  </div>

                  {/* Calendar Integration Section */}
                  <div className="mt-6 p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                    <p className="text-xs text-gray-600 dark:text-gray-300 mb-2">
                      Link your calendar for{" "}
                      <span className="font-medium">
                        20 free meeting transcriptions
                      </span>
                      .
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
                      Notta Bot will join and transcribe your meetings
                      automatically.
                    </p>

                    <div className="space-y-2">
                      <Link
                        href="/connect/google"
                        className="flex items-center justify-center gap-2 p-2 border border-gray-200 dark:border-gray-600 rounded-lg text-xs text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700"
                      >
                        Connect Google Calendar
                      </Link>
                      <Link
                        href="/connect/outlook"
                        className="flex items-center justify-center gap-2 p-2 border border-gray-200 dark:border-gray-600 rounded-lg text-xs text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700"
                      >
                        Connect Microsoft Outlook
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
