import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";

export async function GET() {
  const { userId } = await auth();

  if (!userId) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const meetings = await prisma.meeting.findMany({
    where: { userId },
    select: {
      id: true,
      title: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(meetings);
}
