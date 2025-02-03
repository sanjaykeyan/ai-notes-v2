import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { isNewUser } from "@/lib/user-utils";
import UploadButton from "@/components/upload-button";
import DeleteMeetingButton from "@/components/DeleteMeetingButton";
import MobileDashboardWrapper from "@/components/MobileDashboardWrapper";

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
    take: 5,
  });

  return (
    <>
      {/* Mobile Layout */}
      <div className="lg:hidden h-full">
        <MobileDashboardWrapper 
          firstName={firstName} 
          recentMeetings={JSON.parse(JSON.stringify(recentMeetings))} 
        />
      </div>

      {/* Desktop Layout */}
      <div className="hidden lg:flex flex-row gap-8 h-full"> {/* Increased gap from 4 to 8 */}
        <div className="lg:w-[70%] flex flex-col gap-6"> {/* Increased gap from 2 to 6 */}
          {/* Welcome Section - removed box styling */}
          <div className="text-center py-6">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-3">
              Welcome {firstName}!
            </h1>
            <p className="text-gray-600 text-lg">
              Transform your meetings into actionable insights
            </p>
          </div>

          {/* Upload Section */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-8"> {/* Increased padding from 3 to 8 */}
            <div className="flex flex-col items-center gap-3">
              <UploadButton />
              <p className="text-sm text-gray-500">
                Supported: MP3, WAV (Max: 70MB)
              </p>
            </div>
          </div>

          {/* Tutorial Section */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-8"> {/* Increased padding from 3 to 8 */}
            <h2 className="text-xl font-semibold mb-6 text-center"> {/* Increased text size and margin */}
              How it works
            </h2>
            <div className="grid grid-cols-3 gap-8"> {/* Increased gap from 3 to 8 */}
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
                  description: "Get your meeting notes and share with your team",
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
                      <div className={`w-10 h-10 mx-auto mb-2 rounded-xl bg-gradient-to-br ${item.color} 
                                   flex items-center justify-center transform rotate-6 
                                   group-hover:rotate-12 transition-transform duration-300`}
                      >
                        <span className="text-lg">{item.icon}</span>
                      </div>
                      <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-white 
                                   border-2 border-gray-100 flex items-center justify-center"
                      >
                        <span className="text-[10px] font-semibold text-gray-600">
                          {item.step}
                        </span>
                      </div>
                    </div>
                    <h3 className="text-sm font-semibold mb-1">
                      {item.title}
                    </h3>
                    <p className="text-xs text-gray-600">
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
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 sticky top-[5rem] h-full">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-800">Recent Meetings</h2>
              <span className="text-sm text-gray-500">{recentMeetings.length} total</span>
            </div>
            
            {recentMeetings.length > 0 ? (
              <div className="h-[calc(100%-4rem)] overflow-y-auto">
                <table className="w-full">
                  <thead className="text-xs text-gray-500 border-b border-gray-200">
                    <tr>
                      <th className="pb-2 font-medium text-left">Meeting Name</th>
                      <th className="pb-2 font-medium text-left">Date</th>
                      <th className="pb-2 font-medium text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {recentMeetings.map((meeting) => (
                      <tr key={meeting.id} className="group hover:bg-gray-50/50">
                        <td className="py-3">
                          <a
                            href={`/meetings/${meeting.id}`}
                            className="text-sm font-medium text-gray-900 hover:text-blue-600 transition-colors"
                          >
                            {meeting.title || "Untitled Meeting"}
                          </a>
                        </td>
                        <td className="py-3">
                          <span className="text-sm text-gray-500">
                            {new Date(meeting.createdAt).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric'
                            })}
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
                <div className="w-12 h-12 mx-auto mb-4 bg-gray-50 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                          d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                  </svg>
                </div>
                <p className="text-gray-500">No meetings yet</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
