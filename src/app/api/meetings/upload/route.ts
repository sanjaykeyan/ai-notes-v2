import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    console.log("Current userId:", userId);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get("file") as File;
    const title = formData.get("title") as string;

    if (!file || !title) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // First response to indicate upload complete
    const uploadStream = new TransformStream();
    const writer = uploadStream.writable.getWriter();
    const encoder = new TextEncoder();

    const responseStream = new Response(uploadStream.readable, {
      headers: { "Content-Type": "text/event-stream" },
    });

    // Send "uploading complete" message
    writer.write(encoder.encode('data: {"status": "processing"}\n\n'));

    // Send to Flask server
    const flaskResponse = await fetch("http://127.0.0.1:5000/upload", {
      method: "POST",
      body: formData,
    });

    if (!flaskResponse.ok) {
      throw new Error(`Flask server error: ${flaskResponse.statusText}`);
    }

    const { transcription, summary } = await flaskResponse.json();

    // Store in database
    const meeting = await prisma.meeting.create({
      data: {
        title,
        transcript: transcription,
        summary,
        userId,
      },
    });

    writer.write(
      encoder.encode(
        `data: {"status": "complete", "meeting": ${JSON.stringify(
          meeting
        )}}\n\n`
      )
    );
    writer.close();

    return responseStream;
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Processing failed" }, { status: 500 });
  }
}
