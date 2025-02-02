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
      <div className="hidden lg:flex flex-row gap-4 h-full">
        <div className="lg:w-2/3 flex flex-col gap-2"> {/* Further reduced gap */}
          {/* Welcome Section - More compact */}
          <div className="text-center">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Welcome {firstName}!
            </h1>
            <p className="text-gray-600 text-sm">
              Transform your meetings into actionable insights
            </p>
          </div>

          {/* Upload Section - More compact */}
          <div className="bg-white/70 backdrop-blur-sm rounded-xl shadow-lg p-3">
            <div className="flex justify-center">
              <UploadButton />
            </div>
            <p className="text-xs text-gray-500 text-center mt-1">
              Supported: MP3,WAV (Max:70MB)
            </p>
          </div>

          {/* Tutorial Section - More compact */}
          <div className="bg-white/70 backdrop-blur-sm rounded-xl shadow-lg p-3">
            <h2 className="text-base font-medium mb-3 text-center">
              How it works
            </h2>
            <div className="grid grid-cols-3 gap-3">
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

        {/* Right Column - Adjusted height */}
        <div className="lg:w-1/3">
          <div className="bg-white/70 backdrop-blur-sm rounded-xl shadow-lg p-3 h-full">
            <h2 className="text-base font-semibold mb-2">Recent Meetings</h2>
            {recentMeetings.length > 0 ? (
              <div className="flex-1 overflow-y-auto max-h-[calc(100vh-250px)]">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-2 text-sm font-medium text-gray-600">
                        Name
                      </th>
                      <th className="text-left py-3 px-2 text-sm font-medium text-gray-600">
                        Date
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentMeetings.map((meeting) => (
                      <tr
                        key={meeting.id}
                        className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                      >
                        <td className="py-3 px-2">
                          <div className="flex items-center justify-between">
                            <a
                              href={`/meetings/${meeting.id}`}
                              className="text-blue-600 hover:text-blue-800 font-medium"
                            >
                              {meeting.title || "Untitled Meeting"}
                            </a>
                            <DeleteMeetingButton id={meeting.id} />
                          </div>
                        </td>
                        <td className="py-3 px-2 text-sm text-gray-600">
                          {new Date(meeting.createdAt).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <p className="text-center text-gray-500">
                  No meetings yet. Upload a meeting recording to get started!
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
