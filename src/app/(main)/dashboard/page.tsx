import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { isNewUser } from "@/lib/user-utils";
import UploadButton from "@/components/upload-button";
import DeleteMeetingButton from "@/components/DeleteMeetingButton";
import MobileDashboardWrapper from "@/components/MobileDashboardWrapper";
import Link from "next/link";

export default async function NewUserDashboard() {
  const { userId } = await auth();
  const user = await currentUser();

  if (!userId) {
    redirect("/auth/sign-in");
  }

  const firstName = user?.firstName || "there";
  const isFirstTimer = await isNewUser(userId);

  const recentMeetings = await prisma.meeting.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      title: true,
      createdAt: true,
      isLiveRecorded: true, // Add this field
    },
    take: 5,
  });

  return (
    <>
      {/* Mobile Layout */}
      <div className="lg:hidden h-full dark:bg-gray-900">
        <MobileDashboardWrapper
          firstName={firstName}
          recentMeetings={JSON.parse(JSON.stringify(recentMeetings))}
        />
      </div>

      {/* Desktop Layout */}
      <div className="hidden lg:flex flex-row gap-8 h-full dark:bg-gray-900">
        <div className="lg:w-[70%] flex flex-col gap-6">
          {/* Welcome Section */}
          <div className="text-center py-6">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-3">
              Welcome {firstName}!
            </h1>
            <p className="text-gray-600 dark:text-gray-400 text-lg">
              Transform your meetings into actionable insights
            </p>
          </div>

          {/* Upload Section */}
          <div className="bg-white/80 dark:bg-gray-800/50 backdrop-blur-sm rounded-2xl shadow-lg p-8 border border-gray-100 dark:border-gray-700">
            <div className="flex flex-col items-center gap-3">
              <div className="flex gap-4">
                <UploadButton />
                <Link
                  href="/online-meets"
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:opacity-90 transition-opacity"
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
                  Record Live Meeting
                </Link>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Supported: MP3, WAV (Max: 70MB)
              </p>
            </div>
          </div>

          {/* Tutorial Section */}
          <div className="bg-white/80 dark:bg-gray-800/50 backdrop-blur-sm rounded-2xl shadow-lg p-8 border border-gray-100 dark:border-gray-700">
            <h2 className="text-xl font-semibold mb-6 text-center text-gray-900 dark:text-gray-100">
              How it works
            </h2>
            <div className="grid grid-cols-3 gap-8">
              {[
                {
                  step: "1",
                  title: "Upload Recording",
                  description:
                    "Upload your meeting recording in MP3 or MP4 format",
                  icon: "📤",
                  color: "from-blue-500 to-blue-600",
                },
                {
                  step: "2",
                  title: "AI Processing",
                  description: "Our AI transcribes and summarizes your meeting",
                  icon: "🤖",
                  color: "from-purple-500 to-purple-600",
                },
                {
                  step: "3",
                  title: "Review & Share",
                  description:
                    "Get your meeting notes and share with your team",
                  icon: "✨",
                  color: "from-indigo-500 to-indigo-600",
                },
              ].map((item) => (
                <div
                  key={item.step}
                  className="relative group hover:scale-105 transition-transform duration-300"
                >
                  <div className="text-center">
                    <div className="relative">
                      <div
                        className={`w-10 h-10 mx-auto mb-2 rounded-xl bg-gradient-to-br ${item.color} 
                                   flex items-center justify-center transform rotate-6 
                                   group-hover:rotate-12 transition-transform duration-300`}
                      >
                        <span className="text-lg">{item.icon}</span>
                      </div>
                      <div
                        className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-white dark:bg-gray-800 
                                   border-2 border-gray-100 dark:border-gray-700 flex items-center justify-center"
                      >
                        <span className="text-[10px] font-semibold text-gray-600 dark:text-gray-400">
                          {item.step}
                        </span>
                      </div>
                    </div>
                    <h3 className="text-sm font-semibold mb-1 text-gray-900 dark:text-gray-100">
                      {item.title}
                    </h3>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="lg:w-[30%]">
          <div className="bg-white/80 dark:bg-gray-800/50 backdrop-blur-sm rounded-2xl shadow-lg p-6 sticky top-[5rem] h-full border border-gray-100 dark:border-gray-700">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
                Recent Meetings
              </h2>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {recentMeetings.length} total
              </span>
            </div>

            {recentMeetings.length > 0 ? (
              <div className="h-[calc(100%-4rem)] overflow-y-auto">
                <table className="w-full">
                  <thead className="text-xs text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700">
                    <tr>
                      <th className="pb-2 font-medium text-left">
                        Meeting Name
                      </th>
                      <th className="pb-2 font-medium text-left">Date</th>
                      <th className="pb-2 font-medium text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                    {recentMeetings.map((meeting) => (
                      <tr
                        key={meeting.id}
                        className="group hover:bg-gray-50/50 dark:hover:bg-gray-700/50"
                      >
                        <td className="py-3">
                          <div className="flex items-center gap-2">
                            <a
                              href={`/meetings/${meeting.id}`}
                              className="text-sm font-medium text-gray-900 dark:text-gray-100 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                            >
                              {meeting.title || "Untitled Meeting"}
                            </a>
                            {meeting.isLiveRecorded && (
                              <span className="px-2 py-0.5 text-xs font-medium bg-purple-100 dark:bg-purple-900/50 text-purple-600 dark:text-purple-300 rounded-full">
                                Live Recording
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="py-3">
                          <span className="text-sm text-gray-500 dark:text-gray-400">
                            {new Date(meeting.createdAt).toLocaleDateString()}
                          </span>
                        </td>
                        <td className="py-3 text-right">
                          <DeleteMeetingButton id={meeting.id} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="h-[calc(100%-4rem)] flex items-center justify-center">
                <div className="text-center">
                  <div className="w-12 h-12 mx-auto mb-4 bg-gray-50 dark:bg-gray-700 rounded-full flex items-center justify-center">
                    <svg
                      className="w-6 h-6 text-gray-400 dark:text-gray-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
                      />
                    </svg>
                  </div>
                  <p className="text-gray-500 dark:text-gray-400">
                    No meetings yet
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
