import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await req.formData();
    const audioFile = formData.get("audio") as File;
    const title = formData.get("title") as string;

    if (!audioFile) {
      return NextResponse.json(
        { error: "No audio file provided" },
        { status: 400 }
      );
    }

    // Upload to python server for processing
    const pythonServerUrl =
      process.env.PYTHON_SERVER_URL || "http://localhost:5000";
    const uploadFormData = new FormData();
    uploadFormData.append("file", audioFile);

    const response = await fetch(`${pythonServerUrl}/upload`, {
      method: "POST",
      body: uploadFormData,
    });

    if (!response.ok) {
      throw new Error("Failed to process audio file");
    }

    const { transcription, summary, timestamp_mapping, duration } =
      await response.json();

    // Save to database
    const meeting = await prisma.onlineMeeting.create({
      data: {
        title,
        transcript: transcription,
        summary,
        duration,
        timestampMapping: timestamp_mapping,
        userId,
      },
    });

    return NextResponse.json(meeting);
  } catch (error) {
    console.error("Error processing meeting:", error);
    return NextResponse.json(
      { error: "Failed to process meeting" },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  try {
    const { userId } = auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const meetings = await prisma.onlineMeeting.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(meetings);
  } catch (error) {
    console.error("Error fetching meetings:", error);
    return NextResponse.json(
      { error: "Failed to fetch meetings" },
      { status: 500 }
    );
  }
}
