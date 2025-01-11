import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";

export async function POST(req: Request) {
  try {
    // Validate auth
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Parse and validate request body
    let body;
    try {
      body = await req.json();
    } catch (e) {
      console.error("JSON Parse Error:", e);
      return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
    }

    const { title, transcript } = body;

    // Validate required fields
    if (!transcript || typeof transcript !== "string") {
      return NextResponse.json(
        { error: "Valid transcript is required" },
        { status: 400 }
      );
    }
    if (!title || typeof title !== "string") {
      return NextResponse.json(
        { error: "Valid title is required" },
        { status: 400 }
      );
    }

    console.log("Creating meeting for user:", userId, "with title:", title);

    try {
      // Create meeting record
      const meeting = await prisma.meeting.create({
        data: {
          title: title.trim(),
          transcript: transcript.trim(),
          userId,
          summary: null,
          recordingUrl: null,
        },
        select: {
          id: true,
          title: true,
          createdAt: true,
        },
      });

      console.log("Meeting created successfully:", meeting.id);

      return NextResponse.json({ success: true, meeting });
    } catch (e) {
      // Handle specific database errors
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        console.error("Prisma Error:", e.code, e.message);
        return NextResponse.json(
          { error: `Database error: ${e.code}` },
          { status: 500 }
        );
      }
      throw e; // Let the outer catch handle other errors
    }
  } catch (error) {
    // Log the full error for debugging
    console.error("Server Error:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        details:
          process.env.NODE_ENV === "development"
            ? error instanceof Error
              ? error.message
              : String(error)
            : undefined,
      },
      { status: 500 }
    );
  }
}
