import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { Groq } from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Verify API key is present
    if (!process.env.GROQ_API_KEY) {
      console.error("GROQ_API_KEY is not configured");
      throw new Error("GROQ API key is not configured");
    }

    console.log("Looking for meeting:", params.id);
    const meeting = await prisma.meeting.findUnique({
      where: { id: params.id },
      select: { transcript: true },
    });

    if (!meeting) {
      console.log("Meeting not found");
      return NextResponse.json({ error: "Meeting not found" }, { status: 404 });
    }

    if (!meeting.transcript) {
      console.log("Transcript is empty");
      return NextResponse.json(
        { error: "Transcript not found" },
        { status: 404 }
      );
    }

    console.log("Calling Groq API...");
    const completion = await groq.chat.completions
      .create({
        messages: [
          {
            role: "system",
            content:
              "Extract dates, metrics, and tasks from this transcript and return as JSON.",
          },
          {
            role: "user",
            content: meeting.transcript,
          },
        ],
        model: "llama-3.3-70b-versatile", // Try a different model
        temperature: 0.3,
        max_tokens: 1000,
      })
      .catch((error) => {
        console.error("Groq API Error:", error);
        throw error;
      });

    console.log("Groq API Response:", completion.choices[0]?.message);
    return NextResponse.json({
      content: completion.choices[0]?.message?.content,
    });
  } catch (error: any) {
    console.error("Detailed error:", {
      message: error.message,
      stack: error.stack,
      details: error,
    });
    return NextResponse.json(
      {
        error: "Failed to process transcript",
        details: error.message,
      },
      { status: 500 }
    );
  }
}
