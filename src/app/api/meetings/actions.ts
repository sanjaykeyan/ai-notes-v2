"use server";

import prisma from "@/lib/prisma";

export async function renameMeeting(meetingId: string, newTitle: string) {
  const meeting = await prisma.meeting.update({
    where: { id: meetingId },
    data: { title: newTitle },
  });
  return meeting;
}
