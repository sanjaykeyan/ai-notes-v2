import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import DeleteMeetingButton from "@/components/DeleteMeetingButton";
import { EyeIcon } from "@heroicons/react/24/outline";
import UploadButton from "@/components/upload-button";

export default async function MeetingsPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/auth/sign-in");
  }

  const meetings = await prisma.meeting.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    include: {
      speakerMappings: true,
    },
  });

  return (
    <div className="h-[calc(100vh-64px)] overflow-auto bg-gray-50">
      <div className="p-4 md:p-6">
        <div className="max-w-7xl mx-auto space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <h1 className="text-lg font-semibold text-gray-900">Your Meetings</h1>
            <UploadButton type="meeting" />
          </div>
          
          <div className="bg-white rounded-lg shadow-lg border border-gray-100 overflow-hidden">
            {/* Mobile View - Card Layout */}
            <div className="md:hidden divide-y divide-gray-200">
              {meetings.map((meeting) => (
                <div key={meeting.id} className="p-4 hover:bg-gray-50/60">
                  <div className="flex justify-between items-start mb-2">
                    <a
                      href={`/meetings/${meeting.id}`}
                      className="text-blue-600 hover:text-blue-800 font-medium hover:underline"
                    >
                      {meeting.title || "Untitled Meeting"}
                    </a>
                    <div className="flex items-center gap-2">
                      <a
                        href={`/meetings/${meeting.id}`}
                        className="text-gray-600 hover:text-blue-600 transition-colors duration-150"
                      >
                        <EyeIcon className="h-5 w-5" />
                      </a>
                      <DeleteMeetingButton id={meeting.id} />
                    </div>
                  </div>
                  <div className="space-y-2 text-sm">
                    <p className="text-gray-500">
                      {new Date(meeting.createdAt).toLocaleDateString()}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {meeting.speakerMappings.map((speaker, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700"
                        >
                          {speaker.customName}
                        </span>
                      ))}
                      {meeting.speakerMappings.length === 0 && (
                        <span className="text-gray-400 text-sm">No speakers</span>
                      )}
                    </div>
                    <p className="text-gray-500">Duration: {meeting.duration || "N/A"}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop View - Table Layout */}
            <div className="hidden md:block overflow-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-4 md:px-6 py-3 md:py-4 text-left text-sm md:text-base font-medium text-blue-700">
                      Title
                    </th>
                    <th className="px-4 md:px-6 py-3 md:py-4 text-left text-sm md:text-base font-medium text-blue-700">
                      Date
                    </th>
                    <th className="px-4 md:px-6 py-3 md:py-4 text-left text-sm md:text-base font-medium text-blue-700">
                      Speakers
                    </th>
                    <th className="px-4 md:px-6 py-3 md:py-4 text-left text-sm md:text-base font-medium text-blue-700">
                      Duration
                    </th>
                    <th className="px-4 md:px-6 py-3 md:py-4 text-right text-sm md:text-base font-medium text-blue-700">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {meetings.map((meeting) => (
                    <tr
                      key={meeting.id}
                      className="hover:bg-gray-50/60 transition-colors duration-150"
                    >
                      <td className="px-6 py-4">
                        <a
                          href={`/meetings/${meeting.id}`}
                          className="text-blue-600 hover:text-blue-800 font-medium hover:underline"
                        >
                          {meeting.title || "Untitled Meeting"}
                        </a>
                      </td>
                      <td className="px-6 py-4 text-gray-500">
                        {new Date(meeting.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-2">
                          {meeting.speakerMappings.map((speaker, index) => (
                            <span
                              key={index}
                              className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700"
                            >
                              {speaker.customName}
                            </span>
                          ))}
                          {meeting.speakerMappings.length === 0 && (
                            <span className="text-gray-400 text-sm">
                              No speakers
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-500">
                        {meeting.duration || "N/A"}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-4">
                          <a
                            href={`/meetings/${meeting.id}`}
                            className="text-gray-600 hover:text-blue-600 transition-colors duration-150"
                          >
                            <EyeIcon className="h-5 w-5" />
                          </a>
                          <DeleteMeetingButton id={meeting.id} />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {meetings.length === 0 && (
              <div className="text-center py-8 md:py-12">
                <p className="text-gray-500 text-sm md:text-base">No meetings found</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
