import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const meeting = await prisma.meeting.findUnique({
      where: {
        id: params.id,
      },
      select: {
        id: true,
        title: true,
        transcript: true,
        summary: true,
        recordingUrl: true, // Add this field
        timestampMapping:true,
        createdAt: true,
        userId: true,
      },
    });

    // Debug logging
    console.log("Raw meeting data:", {
      hasTimestampMapping: Boolean(meeting?.timestampMapping),
      timestampMappingType: typeof meeting?.timestampMapping,
      rawTimestampMapping: meeting?.timestampMapping
    });

    if (!meeting) {
      return NextResponse.json({ error: "Meeting not found" }, { status: 404 });
    }

    if (meeting.userId !== userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Parse timestampMapping correctly
    let parsedTimestampMapping = [];
    try {
      if (meeting?.timestampMapping) {
        parsedTimestampMapping = typeof meeting.timestampMapping === 'string'
          ? JSON.parse(meeting.timestampMapping)
          : meeting.timestampMapping;
      }
      console.log("Timestamp mapping type:", typeof parsedTimestampMapping);
      console.log("First item:", parsedTimestampMapping[0]);
    } catch (e) {
      console.error('Error parsing timestamp mapping:', e);
    }

    const parsedMeeting = {
      ...meeting,
      timestampMapping: parsedTimestampMapping
    };

    return NextResponse.json(parsedMeeting);
  } catch (error) {
    console.error("Error fetching meeting:", error);
    return NextResponse.json(
      { error: "Failed to fetch meeting" },
      { status: 500 }
    );
  }
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
