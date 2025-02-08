import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { isNewUser } from "@/lib/user-utils";
import UploadButton from "@/components/upload-button";
import DeleteMeetingButton from "@/components/DeleteMeetingButton";
import MobileDashboardWrapper from "@/components/MobileDashboardWrapper";
import MeetingInsightsFeed from "@/components/MeetingInsightsFeed";
import HelpDialog from "@/components/HelpDialog";

import Link from "next/link";

export default async function NewUserDashboard() {
  const { userId } = await auth();
  const user = await currentUser();

  if (!userId) {
    redirect("/auth/sign-in");
  }

  const firstName = user?.firstName || "there";
  const isFirstTimer = await isNewUser(userId);

  const [recentMeetings, totalMeetings, latestMeeting] = await Promise.all([
    prisma.meeting.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        title: true,
        createdAt: true,
        isLiveRecorded: true,
      },
      take: 5,
    }),
    prisma.meeting.count({
      where: { userId },
    }),
    prisma.meeting.findFirst({
      where: { userId },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        title: true,
        createdAt: true,
        summary: true,
        keyTakeaways: true,
        actionItems: true,
        isLiveRecorded: true,
        duration: true,
        speakerMappings: {
          select: {
            customName: true,
            originalName: true,
          },
        },
        timestampMapping: true,
      },
    }),
  ]);

  return (
    <>
      {/* Mobile Layout */}
      <div className="lg:hidden min-h-screen dark:bg-gray-900">
        <MobileDashboardWrapper
          firstName={firstName}
          recentMeetings={JSON.parse(JSON.stringify(recentMeetings))}
        />
      </div>

      {/* Desktop Layout */}
      <div className="hidden lg:flex gap-6 relative pb-6">
        {/* Main Content */}
        <div className="flex-1">
          <div className="flex flex-col bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
            {/* Welcome Section - Removed individual border */}
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <div className="max-w-2xl">
                <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
                  Welcome back{firstName !== "there" ? `, ${firstName}` : ""}
                </h1>
                <p className="text-gray-500 dark:text-gray-400 mt-1">
                  Manage your meetings and get AI-powered insights
                </p>
              </div>
              <div className="flex items-center gap-4 mt-6">
                <UploadButton />
                <Link
                  href="/online-meets"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-lg transition-colors"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                    />
                  </svg>
                  Live Recording
                </Link>
              </div>
            </div>

            {/* Stats Grid - Removed individual borders except separators */}
            <div className="grid grid-cols-3 gap-0">
              {[
                {
                  label: "Total Meetings",
                  value: totalMeetings,
                  icon: (
                    <svg
                      className="w-5 h-5 text-blue-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                      />
                    </svg>
                  ),
                },
                {
                  label: "This Month",
                  value: recentMeetings.length,
                  icon: (
                    <svg
                      className="w-5 h-5 text-green-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                  ),
                },
                {
                  label: "Time Saved",
                  value: "~2.5 hrs",
                  icon: (
                    <svg
                      className="w-5 h-5 text-purple-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  ),
                },
              ].map((stat, index) => (
                <div
                  key={stat.label}
                  className={`p-6 border-b border-gray-200 dark:border-gray-700 ${
                    index !== 2 ? "border-r" : ""
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-lg bg-gray-50 dark:bg-gray-700">
                      {stat.icon}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        {stat.label}
                      </p>
                      <p className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
                        {stat.value}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Meeting Insights Card - Removed individual border */}
            <div className="p-4">
              <MeetingInsightsFeed meeting={latestMeeting} />
            </div>
          </div>
        </div>

        {/* Recent Meetings Sidebar */}
        <div className="w-[400px] flex-shrink-0">
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden h-full">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                    Recent Meetings
                  </h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    Last {recentMeetings.length} of {totalMeetings} meetings
                  </p>
                </div>
                <Link
                  href="/meetings"
                  className="flex items-center gap-1 text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                >
                  View All
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </Link>
              </div>
              <div className="overflow-y-auto">
                {recentMeetings.length > 0 ? (
                  <div className="divide-y divide-gray-200 dark:divide-gray-700">
                    {recentMeetings.map((meeting, index) => (
                      <div
                        key={meeting.id}
                        className={`block p-3 hover:bg-gray-50/50 dark:hover:bg-gray-700/50 transition-colors group relative ${
                          index === recentMeetings.length - 1
                            ? "border-b-0"
                            : ""
                        }`}
                      >
                        <div className="flex items-start justify-between gap-4">
                          <Link
                            href={`/meetings/${meeting.id}`}
                            className="flex-1"
                          >
                            <p className="text-sm font-medium text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                              {meeting.title || "Untitled Meeting"}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                              {new Date(meeting.createdAt).toLocaleDateString()}
                            </p>
                          </Link>
                          <div className="flex items-center gap-2">
                            {meeting.isLiveRecorded && (
                              <span className="px-2 py-0.5 text-xs font-medium bg-purple-100 dark:bg-purple-900/50 text-purple-600 dark:text-purple-300 rounded-full">
                                Live
                              </span>
                            )}
                            <DeleteMeetingButton id={meeting.id} />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center text-gray-500 dark:text-gray-400 py-12">
                    No meetings yet
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <HelpDialog />
    </>
  );
}
