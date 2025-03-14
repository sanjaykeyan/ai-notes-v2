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
    const audioFile = formData.get("file") as File;
    const title = formData.get("title") as string;
    const isLiveRecorded = formData.get("isLiveRecorded") === "true";

    if (!audioFile) {
      return NextResponse.json(
        { error: "No audio file provided" },
        { status: 400 }
      );
    }

    // Convert File to ArrayBuffer and then to Buffer for Python server
    const arrayBuffer = await audioFile.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Create a new File object from the buffer
    const newFile = new File([buffer], "recorded-audio.webm", {
      type: "audio/webm",
    });

    // Upload to python server for processing
    const pythonServerUrl =
      process.env.PYTHON_SERVER_URL || "http://localhost:5000";
    const uploadFormData = new FormData();
    uploadFormData.append("file", newFile);

    console.log("Sending to Python server:", {
      fileSize: newFile.size,
      fileType: newFile.type,
      fileName: newFile.name,
    });

    const response = await fetch(`${pythonServerUrl}/upload`, {
      method: "POST",
      body: uploadFormData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Python server error:", errorText);
      throw new Error(`Failed to process audio file: ${errorText}`);
    }

    const { transcription, summary, timestamp_mapping, duration } =
      await response.json();

    // Save to database
    const meeting = await prisma.meeting.create({
      data: {
        title,
        transcript: transcription,
        summary,
        duration,
        timestampMapping: timestamp_mapping,
        userId,
        isLiveRecorded,
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
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const meetings = await prisma.meeting.findMany({
      where: { 
        userId,
        isLiveRecorded: true 
      },
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
