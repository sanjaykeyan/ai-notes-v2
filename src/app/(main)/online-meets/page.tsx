import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import OnlineMeetsClient from "./online-meets-client";

export default async function OnlineMeetsPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/auth/sign-in");
  }

  // Fetch live recorded meetings for the user
  const recentMeetings = await prisma.meeting.findMany({
    where: {
      userId,
      isLiveRecorded: true,
    },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      title: true,
      createdAt: true,
      duration: true,
      isLiveRecorded: true,
    },
  });

  return (
    <OnlineMeetsClient
      initialMeetings={JSON.parse(JSON.stringify(recentMeetings))}
    />
  );
}
