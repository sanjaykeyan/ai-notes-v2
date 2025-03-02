"use server";

import prisma from "@/lib/prisma";

export async function deleteMeeting(id: string) {
  try {
    await prisma.meeting.delete({
      where: { id },
    });
    return { success: true };
  } catch (error) {
    console.error("Error deleting meeting:", error);
    throw new Error("Failed to delete meeting");
  }
}
