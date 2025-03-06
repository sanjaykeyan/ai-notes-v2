"use server";

import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createFolder(name: string) {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  const folder = await prisma.folder.create({
    data: {
      name,
      userId,
    },
  });

  revalidatePath("/meetings");
  return folder;
}

export async function deleteFolder(folderId: string) {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  const folder = await prisma.folder.delete({
    where: {
      id: folderId,
      userId, // Ensure the folder belongs to the user
    },
  });

  revalidatePath("/meetings");
  return folder;
}

export async function updateMeetingFolder(
  meetingId: string,
  folderId: string | null
) {
  try {
    const meeting = await prisma.meeting.update({
      where: { id: meetingId },
      data: { folderId },
    });
    return meeting;
  } catch (error) {
    console.error("Error updating meeting folder:", error);
    throw new Error("Failed to update meeting folder");
  }
}

export async function renameFolder(folderId: string, newName: string) {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  try {
    const folder = await prisma.folder.update({
      where: {
        id: folderId,
        userId, // Ensure the folder belongs to the user
      },
      data: { name: newName },
    });

    revalidatePath("/meetings");
    return folder;
  } catch (error) {
    console.error("Error renaming folder:", error);
    throw new Error("Failed to rename folder");
  }
}
