import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  const resolvedParams = params instanceof Promise ? await params : params;

  const meeting = await prisma.meeting.findUnique({
    where: { id: resolvedParams.id },
    select: {
      id: true,
      title: true,
      transcript: true,
      summary: true,
      createdAt: true,
    },
  });

  if (!meeting) {
    return new NextResponse("Not Found", { status: 404 });
  }

  return NextResponse.json(meeting);
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    const resolvedParams = params instanceof Promise ? await params : params;
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await prisma.meeting.delete({
      where: {
        id: resolvedParams.id,
        userId,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    console.error("Failed to delete meeting:", error);
    return NextResponse.json(
      { error: "Failed to delete meeting" },
      { status: 500 }
    );
  }
}
