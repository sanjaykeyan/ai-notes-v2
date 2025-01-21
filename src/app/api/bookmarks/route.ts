import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getAuth } from "@clerk/nextjs/server";

export async function POST(request: NextRequest) {
  try {
    const { userId } = getAuth(request);
    if (!userId) {
      return NextResponse.json(
        {
          error: "Unauthorized",
          message: "Please sign in to create bookmarks",
        },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { text, meetingId } = body;

    // Validate input
    if (!text || !meetingId) {
      return NextResponse.json(
        {
          error: "Bad Request",
          message: "Missing required fields: text and meetingId",
        },
        { status: 400 }
      );
    }

    // Verify meeting belongs to user
    const meeting = await prisma.meeting.findFirst({
      where: {
        id: meetingId,
        userId,
      },
    });

    if (!meeting) {
      return NextResponse.json(
        {
          error: "Not Found",
          message: "Meeting not found or you don't have access to it",
        },
        { status: 404 }
      );
    }

    // Create bookmark
    const bookmark = await prisma.bookmark.create({
      data: {
        text,
        meetingId,
      },
    });

    return NextResponse.json({
      message: "Bookmark created successfully",
      bookmark,
    });
  } catch (error) {
    console.error("Error creating bookmark:", error);
    return NextResponse.json(
      {
        error: "Internal Server Error",
        message: "Failed to create bookmark. Please try again later.",
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { userId } = getAuth(request);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const meetingId = searchParams.get("meetingId");

    if (!meetingId) {
      return NextResponse.json(
        { error: "Meeting ID is required" },
        { status: 400 }
      );
    }

    // Verify meeting belongs to user
    const meeting = await prisma.meeting.findFirst({
      where: {
        id: meetingId,
        userId,
      },
    });

    if (!meeting) {
      return NextResponse.json(
        { error: "Meeting not found or unauthorized" },
        { status: 404 }
      );
    }

    // Fetch bookmarks
    const bookmarks = await prisma.bookmark.findMany({
      where: {
        meetingId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(bookmarks);
  } catch (error) {
    console.error("Error fetching bookmarks:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { userId } = getAuth(request);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const bookmarkId = searchParams.get("id");

    if (!bookmarkId) {
      return NextResponse.json(
        { error: "Bookmark ID is required" },
        { status: 400 }
      );
    }

    // Find the bookmark and its associated meeting
    const bookmark = await prisma.bookmark.findUnique({
      where: { id: bookmarkId },
      include: { meeting: true },
    });

    if (!bookmark) {
      return NextResponse.json(
        { error: "Bookmark not found" },
        { status: 404 }
      );
    }

    // Verify the meeting belongs to the user
    if (bookmark.meeting.userId !== userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Delete the bookmark
    await prisma.bookmark.delete({
      where: { id: bookmarkId },
    });

    return NextResponse.json({ message: "Bookmark deleted successfully" });
  } catch (error) {
    console.error("Error deleting bookmark:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
