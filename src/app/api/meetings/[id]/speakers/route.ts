import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

type RouteSegment = {
  params: Promise<{
    id: string;
  }>;
};

export async function PUT(
  request: Request,
  segment: RouteSegment
) {
  try {
    // Verify Prisma client is available
    if (!prisma || !prisma.speakerMapping) {
      console.error("Prisma client or SpeakerMapping model not available");
      return NextResponse.json(
        { error: "Database connection error" },
        { status: 500 }
      );
    }

    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Validate meetingId
    const { id: meetingId } = await segment.params;
    if (!meetingId) {
      console.error("Missing meetingId in params");
      return NextResponse.json(
        { error: "Meeting ID is required" },
        { status: 400 }
      );
    }

    // Parse and validate request body
    const body = await request.json();
    const { originalName, customName } = body;

    console.log("Processing speaker update:", {
      meetingId,
      originalName,
      customName,
      userId,
    });

    if (!originalName || !customName) {
      console.error("Missing required fields:", { originalName, customName });
      return NextResponse.json(
        { error: "originalName and customName are required" },
        { status: 400 }
      );
    }

    // First verify meeting exists and user has access
    const meeting = await prisma.meeting.findFirst({
      where: {
        id: meetingId,
        userId: userId,
      },
    });

    if (!meeting) {
      console.error("Meeting not found or access denied:", {
        meetingId,
        userId,
      });
      return NextResponse.json(
        { error: "Meeting not found or access denied" },
        { status: 404 }
      );
    }

    try {
      // Try to find existing mapping first
      const existingMapping = await prisma.speakerMapping.findUnique({
        where: {
          meetingId_originalName: {
            meetingId,
            originalName: originalName.trim(),
          },
        },
      });

      let mapping;
      if (existingMapping) {
        // Update existing mapping
        mapping = await prisma.speakerMapping.update({
          where: {
            id: existingMapping.id,
          },
          data: {
            customName: customName.trim(),
          },
        });
      } else {
        // Create new mapping
        mapping = await prisma.speakerMapping.create({
          data: {
            meetingId,
            originalName: originalName.trim(),
            customName: customName.trim(),
          },
        });
      }

      console.log("Successfully updated speaker mapping:", mapping);
      return NextResponse.json(mapping);
    } catch (dbError) {
      console.error("Database operation failed:", dbError);
      return NextResponse.json(
        { error: "Failed to update speaker mapping" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error in PUT /api/meetings/[id]/speakers:", {
      error,
      stack: error instanceof Error ? error.stack : undefined,
    });

    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

export async function GET(
  req: NextRequest,
  segment: RouteSegment
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: meetingId } = await segment.params;
    if (!meetingId) {
      return NextResponse.json({ error: "Missing meeting ID" }, { status: 400 });
    }

    const mappings = await prisma.speakerMapping.findMany({
      where: {
        meetingId,
        meeting: {
          userId: userId,
        },
      },
      // ...rest of query...
    });

    return NextResponse.json(mappings);
  } catch (error) {
    console.error("Speakers Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch speaker mappings" },
      { status: 500 }
    );
  }
}
