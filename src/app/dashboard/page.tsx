import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { isNewUser } from "@/lib/user-utils";
import Link from "next/link";
import { Upload, Video, Mic, MonitorUp, Calendar } from "lucide-react";
import DashboardButton from "@/components/DashboardButton";
import DeleteMeetingButton from "@/components/DeleteMeetingButton";
import DashboardSidebar from "@/components/DashboardSidebar";
import DashboardTopbar from "@/components/DashboardTopbar";

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
        style={{ marginLeft: "var(--sidebar-width)" }}
      >
        <DashboardTopbar />

        <div className="flex-1 p-1 pl-0 overflow-hidden">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 h-full">
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

            {/* Main Content + Right Pane Container */}
            <div className="flex h-[calc(100%-85px)] overflow-hidden">
              {/* Main Content */}
              <div className="flex-1 flex flex-col overflow-hidden">
                {/* Recording options - Fixed */}
                <div className="p-6">
                  <div className="grid grid-cols-4 gap-4">
                    <DashboardButton
                      Icon={Mic}
                      label="Instant record"
                      href="/record"
                      id="newbie-guide-instant-btn"
                      dataType="instant"
                      iconColor="text-blue-500"
                    />
                    <DashboardButton
                      Icon={Upload}
                      label="Upload & transcribe"
                      href="/upload"
                      id="newbie-guide-upload-btn"
                      dataType="upload"
                      iconColor="text-green-500"
                    />
                    <DashboardButton
                      Icon={Video}
                      label="Record online meeting"
                      href="/online-meets"
                      id="newbie-guide-live-recording-btn"
                      dataType="meeting"
                      iconColor="text-rose-500"
                    />
                    <DashboardButton
                      Icon={MonitorUp}
                      label="Record screen"
                      href="/screen-record"
                      id="newbie-guide-screen-recording-btn"
                      dataType="screen"
                      beta={true}
                      iconColor="text-orange-500"
                    />
                  </div>
                </div>

                {/* My Records Section - Scrollable */}
                <div className="flex-1 px-6 overflow-hidden flex flex-col min-h-0">
                  <h2
                    className="text-sm font-medium mb-4 text-gray-900 dark:text-gray-100 flex-shrink-0"
                    style={{
                      fontFamily:
                        '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                    }}
                  >
                    My Records
                  </h2>

                  <div className="flex-1 overflow-auto elegant-scrollbar">
                    <div className="border border-gray-200 dark:border-gray-700 rounded-lg divide-y divide-gray-200 dark:divide-gray-700">
                      {recentMeetings.length > 0 ? (
                        recentMeetings.map((meeting) => (
                          <div
                            key={meeting.id}
                            className="flex items-center gap-4 p-3 hover:bg-gray-50 dark:hover:bg-gray-700/50"
                          >
                            <div className="flex-1">
                              <h3
                                className="text-xs font-medium text-gray-900 dark:text-gray-100"
                                style={{
                                  fontFamily:
                                    '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                                }}
                              >
                                {meeting.title || "Untitled Meeting"}
                              </h3>
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">
                              {meeting.duration
                                ? `${Math.floor(meeting.duration / 60)}min ${
                                    meeting.duration % 60
                                  }s`
                                : "N/A"}
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">
                              {new Date(meeting.createdAt).toLocaleDateString()}
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="w-6 h-6 rounded-full bg-yellow-500 flex items-center justify-center text-white text-xs">
                                {firstName[0]}
                              </div>
                              <span className="text-sm text-gray-600 dark:text-gray-300">
                                {fullName}
                              </span>
                            </div>
                            <DeleteMeetingButton id={meeting.id} />
                          </div>
                        ))
                      ) : (
                        <div className="p-4 text-center text-xs text-gray-500">
                          No recordings yet
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Pane - Events */}
              <div className="w-80 border-l border-gray-200 dark:border-gray-700 overflow-auto">
                <div className="p-4">
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
