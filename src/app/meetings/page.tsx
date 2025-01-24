import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import DeleteMeetingButton from "@/components/DeleteMeetingButton";
import { EyeIcon } from "@heroicons/react/24/outline";

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
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Your Meetings</h1>
        <p className="text-gray-600">
          Manage and access all your meeting notes
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-lg border border-gray-100">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-blue-50">
                <th className="px-6 py-4 text-left text-sm font-medium text-blue-700">
                  Title
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-blue-700">
                  Date
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-blue-700">
                  Speakers
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-blue-700">
                  Duration
                </th>
                <th className="px-6 py-4 text-right text-sm font-medium text-blue-700">
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
          <div className="text-center py-12">
            <p className="text-gray-500">No meetings found</p>
          </div>
        )}
      </div>
    </div>
  );
}
