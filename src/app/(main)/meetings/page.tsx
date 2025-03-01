import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import DashboardSidebar from "@/components/DashboardSidebar";
import DashboardTopbar from "@/components/DashboardTopbar";
import DeleteMeetingButton from "@/components/DeleteMeetingButton";

export default async function MeetingsPage() {
  const { userId } = await auth();
  const user = await currentUser();

  if (!userId) {
    redirect("/auth/sign-in");
  }

  const meetings = await prisma.meeting.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      title: true,
      createdAt: true,
      duration: true,
    },
  });

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
            {/* Main Content + Left Sidebar Container */}
            <div className="flex h-full overflow-hidden">
              {/* Left Sidebar */}
              <div className="w-72 border-r border-gray-200 dark:border-gray-700 h-full rounded-xl flex flex-col bg-white dark:bg-gray-800 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-gray-100 dark:scrollbar-track-gray-800/50">
                <div className="p-3 space-y-0.5">
                  <div className="flex items-center gap-2 px-3 py-2 rounded-lg text-blue-500 bg-blue-50 dark:bg-blue-900/20">
                    <svg
                      className="w-5 h-5"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                    >
                      <path
                        d="M3 7v10c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V7"
                        strokeWidth="2"
                      />
                      <path
                        d="M21 7H3V5c0-1.1.9-2 2-2h14c1.1 0 2 .9 2 2v2z"
                        strokeWidth="2"
                      />
                    </svg>
                    <span
                      className="text-sm font-medium"
                      style={{
                        fontFamily:
                          '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                      }}
                    >
                      All Records
                    </span>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200">
                    <svg
                      className="w-5 h-5"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                    >
                      <path
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        strokeWidth="2"
                      />
                    </svg>
                    <span
                      className="text-sm"
                      style={{
                        fontFamily:
                          '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                      }}
                    >
                      Recent
                    </span>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200">
                    <svg
                      className="w-5 h-5 text-yellow-400"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                    </svg>
                    <span
                      className="text-sm"
                      style={{
                        fontFamily:
                          '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                      }}
                    >
                      Important
                    </span>
                  </div>
                </div>
              </div>

              {/* Main Content */}
              <div className="flex-1 flex flex-col overflow-hidden">
                {/* Stats Section - Made more compact */}
                <div className="grid grid-cols-3 gap-3 p-3 border-b border-gray-200 dark:border-gray-700">
                  <div className="flex items-center gap-2 p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <div className="p-1.5 bg-blue-100 dark:bg-blue-800 rounded-lg">
                      <svg
                        className="w-4 h-4 text-blue-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      </svg>
                    </div>
                    <div>
                      <div
                        className="text-xs font-medium text-gray-900 dark:text-gray-100"
                        style={{
                          fontFamily:
                            '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                        }}
                      >
                        {meetings.length}
                      </div>
                      <div
                        className="text-xs text-gray-500"
                        style={{
                          fontFamily:
                            '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                        }}
                      >
                        Records
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 p-2 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <div className="p-1.5 bg-green-100 dark:bg-green-800 rounded-lg">
                      <svg
                        className="w-4 h-4 text-green-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </div>
                    <div>
                      <div className="text-xs font-medium text-gray-900 dark:text-gray-100">
                        {(
                          meetings.reduce((acc, m) => acc + m.duration, 0) / 60
                        ).toFixed(1)}
                        m
                      </div>
                      <div className="text-xs text-gray-500">Duration</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 p-2 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                    <div className="p-1.5 bg-purple-100 dark:bg-purple-800 rounded-lg">
                      <svg
                        className="w-4 h-4 text-purple-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                    </div>
                    <div>
                      <div className="text-xs font-medium text-gray-900 dark:text-gray-100">
                        {new Date().toLocaleDateString()}
                      </div>
                      <div className="text-xs text-gray-500">Updated</div>
                    </div>
                  </div>
                </div>

                {/* Records Table */}
                <div className="flex-1 overflow-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-gray-100 dark:scrollbar-track-gray-800/50">
                  <table className="w-full">
                    <thead className="bg-gray-50 dark:bg-gray-800/50">
                      <tr>
                        <th
                          className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider"
                          style={{
                            fontFamily:
                              '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                          }}
                        >
                          Title
                        </th>
                        <th
                          className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider w-32"
                          style={{
                            fontFamily:
                              '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                          }}
                        >
                          Duration
                        </th>
                        <th
                          className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider w-40"
                          style={{
                            fontFamily:
                              '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                          }}
                        >
                          Created
                        </th>
                        <th
                          className="text-right py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider w-20"
                          style={{
                            fontFamily:
                              '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                          }}
                        >
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                      {meetings.map((meeting) => (
                        <tr
                          key={meeting.id}
                          className="hover:bg-gray-50 dark:hover:bg-gray-800/50"
                        >
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-3">
                              <svg
                                className="w-5 h-5 text-orange-500"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                                />
                              </svg>
                              <span
                                className="text-sm font-medium text-gray-900 dark:text-gray-100"
                                style={{
                                  fontFamily:
                                    '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                                }}
                              >
                                {meeting.title}
                              </span>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <span className="text-sm text-gray-500">
                              {Math.round(meeting.duration / 60)}m{" "}
                              {meeting.duration % 60}s
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <span className="text-sm text-gray-500">
                              {new Date(meeting.createdAt).toLocaleDateString(
                                undefined,
                                {
                                  month: "short",
                                  day: "numeric",
                                  year: "numeric",
                                }
                              )}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button className="p-1 text-gray-400 hover:text-gray-500 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
                                <svg
                                  className="w-5 h-5"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                                  />
                                </svg>
                              </button>
                              <DeleteMeetingButton id={meeting.id} />
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
