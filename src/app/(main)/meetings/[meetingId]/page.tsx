import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";

export default async function MeetingDetailsPage({
  params,
}: {
  params: { meetingId: string };
}) {
  const { userId } = await auth();

  if (!userId) {
    redirect("/auth/sign-in");
  }

  const meeting = await prisma.meeting.findUnique({
    where: {
      id: params.meetingId,
    },
    select: {
      id: true,
      title: true,
      transcript: true,
      summary: true,
      duration: true,
      createdAt: true,
      isLiveRecorded: true,
      recordingUrl: true,
      timestampMapping: true,
      bookmarks: {
        select: {
          id: true,
          text: true,
          createdAt: true,
        },
      },
      speakerMappings: {
        select: {
          id: true,
          originalName: true,
          customName: true,
        },
      },
    },
  });

  if (!meeting || meeting.userId !== userId) {
    redirect("/dashboard");
  }

  return (
    <div className="container mx-auto px-6 pt-24 pb-16">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          {/* Meeting Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-bold text-gray-900">
                {meeting.title}
              </h1>
              {meeting.isLiveRecorded && (
                <span className="px-3 py-1 text-sm font-medium bg-purple-100 text-purple-600 rounded-full">
                  Live Recording
                </span>
              )}
            </div>
            <p className="text-sm text-gray-500 mt-2">
              {new Date(meeting.createdAt).toLocaleDateString()} •{" "}
              {Math.round(meeting.duration / 60)} minutes
            </p>
          </div>

          {/* Summary Section */}
          {meeting.summary && (
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4">Summary</h2>
              <div className="prose max-w-none">
                <p className="text-gray-700">{meeting.summary}</p>
              </div>
            </div>
          )}

          {/* Transcript Section */}
          {meeting.transcript && (
            <div>
              <h2 className="text-xl font-semibold mb-4">Transcript</h2>
              <div className="prose max-w-none">
                <p className="text-gray-700">{meeting.transcript}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
