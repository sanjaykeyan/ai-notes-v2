import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import DeleteMeetingButton from "@/components/DeleteMeetingButton";
import { EyeIcon } from "@heroicons/react/24/outline";
import UploadButton from "@/components/upload-button";
import { formatDuration } from "@/lib/utils";
import { ShareMeetingButton } from "@/components/ShareMeetingButton";

export default async function MeetingsPage() {
  const { userId } = await auth();

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
      summary: true, // Changed from nested select
      speakerMappings: {
        select: {
          customName: true,
          id: true // Added id for key prop in mapping
        }
      }
    }
  });

  // Add this debug log to see the summary structure
  console.log('Meeting summaries:', meetings.map(m => ({
    id: m.id,
    hasSummary: !!m.summary,
    summaryContent: m.summary,
    summaryType: m.summary ? typeof m.summary : null
  })));

  return (
    <div className="h-[calc(100vh-64px)] overflow-auto bg-gray-50 dark:bg-gray-900">
      <div className="p-4 md:p-6">
        <div className="max-w-7xl mx-auto space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <h1 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Your Meetings</h1>
            <UploadButton type="meeting" />
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden">
            {/* Mobile View - Card Layout */}
            <div className="md:hidden divide-y divide-gray-200 dark:divide-gray-700">
              {meetings.map((meeting) => (
                <div key={meeting.id} className="p-4 hover:bg-gray-50/60 dark:hover:bg-gray-700/50">
                  <div className="flex justify-between items-start mb-2">
                    <a
                      href={`/meetings/${meeting.id}`}
                      className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium hover:underline"
                    >
                      {meeting.title || "Untitled Meeting"}
                    </a>
                    <div className="flex items-center gap-2">
                      <ShareMeetingButton
                        meetingId={meeting.id}
                        meetingTitle={meeting.title || "Untitled Meeting"}
                        createdAt={meeting.createdAt}
                        duration={meeting.duration}
                        summary={meeting.summary} // Changed: pass the entire summary object
                        iconOnly
                      />
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
                    <p className="text-gray-500 dark:text-gray-400">
                      {new Date(meeting.createdAt).toLocaleDateString()}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {meeting.speakerMappings.map((speaker, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-50 dark:bg-blue-900 text-blue-700 dark:text-blue-300"
                        >
                          {speaker.customName}
                        </span>
                      ))}
                      {meeting.speakerMappings.length === 0 && (
                        <span className="text-gray-400 dark:text-gray-500 text-sm">No speakers</span>
                      )}
                    </div>
                    <p className="text-gray-500 dark:text-gray-400">Duration: {formatDuration(meeting.duration)}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop View - Table Layout */}
            <div className="hidden md:block overflow-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                  <tr>
                    <th className="px-4 md:px-6 py-3 md:py-4 text-left text-sm md:text-base font-medium text-blue-700 dark:text-blue-300">
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
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {meetings.map((meeting) => (
                    <tr
                      key={meeting.id}
                      className="hover:bg-gray-50/60 dark:hover:bg-gray-700/50 transition-colors duration-150"
                    >
                      <td className="px-6 py-4">
                        <a
                          href={`/meetings/${meeting.id}`}
                          className="text-blue-600 hover:text-blue-800 font-medium hover:underline"
                        >
                          {meeting.title || "Untitled Meeting"}
                        </a>
                      </td>
                      <td className="px-6 py-4 text-gray-500 dark:text-gray-400">
                        {new Date(meeting.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-2">
                          {meeting.speakerMappings.map((speaker, index) => (
                            <span
                              key={index}
                              className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 dark:bg-blue-900 text-blue-700 dark:text-blue-300"
                            >
                              {speaker.customName}
                            </span>
                          ))}
                          {meeting.speakerMappings.length === 0 && (
                            <span className="text-gray-400 dark:text-gray-500 text-sm">
                              No speakers
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-500 dark:text-gray-400">
                        {formatDuration(meeting.duration)}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-4">
                          <ShareMeetingButton
                            meetingId={meeting.id}
                            meetingTitle={meeting.title || "Untitled Meeting"}
                            createdAt={meeting.createdAt}
                            duration={meeting.duration}
                            summary={meeting.summary} // Changed: pass the entire summary object
                            iconOnly
                          />
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
                <p className="text-gray-500 dark:text-gray-400 text-sm md:text-base">No meetings found</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
