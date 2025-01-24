import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { isNewUser } from "@/lib/user-utils";
import UploadButton from "@/components/upload-button";
import DeleteMeetingButton from "@/components/DeleteMeetingButton";

export default async function NewUserDashboard() {
  const { userId } = await auth();
  const user = await currentUser();

  if (!userId) {
    redirect("/auth/sign-in");
  }

  const firstName = user?.firstName || "there";
  const isFirstTimer = await isNewUser(userId);

  // Fetch recent meetings
  const recentMeetings = await prisma.meeting.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    take: 5,
  });

  return (
    <div className="flex flex-col lg:flex-row gap-6 min-h-[calc(100vh-144px)]">
      {/* Left Column */}
      <div className="lg:w-2/3 space-y-6">
        {/* Welcome Section with Upload */}
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            {isFirstTimer
              ? `Welcome ${firstName}!`
              : `Welcome back, ${firstName}!`}
          </h1>
          <p className="text-gray-600 text-base mb-6">
            {isFirstTimer
              ? "Let's transform your meetings into actionable insights"
              : "Ready to transform another meeting into insights?"}
          </p>

          {/* Upload Buttons */}
          <div className="bg-white/70 backdrop-blur-sm rounded-xl shadow-lg p-6 py-8">
            <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-6">
              <UploadButton type="meeting" isNewUser />
              <span className="text-gray-500 font-medium mx-2">or</span>
              <UploadButton type="transcript" isNewUser />
            </div>
            <div className="mt-4">
              <p className="text-sm text-gray-500">
                Supported: MP3, MP4 (Max: 500MB)
              </p>
            </div>
          </div>
        </div>

        {/* Tutorial Section */}
        <div className="bg-white/70 backdrop-blur-sm rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-6 text-center">
            How it works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
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
                    <div
                      className={`w-12 h-12 mx-auto mb-4 rounded-xl bg-gradient-to-br ${item.color} 
                                   flex items-center justify-center transform rotate-6 
                                   group-hover:rotate-12 transition-transform duration-300`}
                    >
                      <span className="text-xl">{item.icon}</span>
                    </div>
                    <div
                      className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-white 
                                   border-2 border-gray-100 flex items-center justify-center"
                    >
                      <span className="text-xs font-semibold text-gray-600">
                        {item.step}
                      </span>
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Column: Recent Meetings */}
      <div className="lg:w-1/3 flex flex-col">
        <div className="bg-white/70 backdrop-blur-sm rounded-xl shadow-lg p-4 flex-1 flex flex-col sticky top-28">
          <h2 className="text-xl font-semibold mb-4">Recent Meetings</h2>
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
  );
}
