import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import DeleteMeetingButton from "@/components/DeleteMeetingButton";

export default async function MeetingsPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/auth/sign-in");
  }

  const meetings = await prisma.meeting.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Your Meetings</h1>
        <p className="text-gray-600">
          Manage and access all your meeting notes
        </p>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">
                  Title
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">
                  Date
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">
                  Duration
                </th>
                <th className="px-6 py-4 text-right text-sm font-medium text-gray-500">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {meetings.map((meeting) => (
                <tr key={meeting.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <a
                      href={`/meetings/${meeting.id}`}
                      className="text-blue-600 hover:text-blue-800 font-medium"
                    >
                      {meeting.title || "Untitled Meeting"}
                    </a>
                  </td>
                  <td className="px-6 py-4 text-gray-500">
                    {new Date(meeting.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-gray-500">
                    {meeting.duration || "N/A"}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-4">
                      <a
                        href={`/meetings/${meeting.id}`}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        View
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
