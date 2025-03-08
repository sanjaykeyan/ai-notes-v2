import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import Groq from "groq-sdk";
import prisma from "@/lib/prisma";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY || process.env.NEXT_PUBLIC_GROQ_API_KEY,
});

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { message, selectedMeetings } = await req.json();

    if (!message) {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 }
      );
    }

    // Get transcripts from selected meetings
    const meetings = await prisma.meeting.findMany({
      where: {
        id: { in: selectedMeetings },
        userId,
      },
      select: {
        transcript: true,
        title: true,
      },
    });

    const contextText = meetings
      .map((m) => `Meeting: ${m.title}\nTranscript: ${m.transcript}`)
      .join("\n\n");

    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content:
            "You are a helpful AI assistant that helps users find information in their meeting transcripts. Answer questions based on the meeting context provided.",
        },
        {
          role: "user",
          content: `Context:\n${contextText}\n\nQuestion: ${message}`,
        },
      ],
      model: "mixtral-8x7b-32768",
      temperature: 0.5,
      max_tokens: 1024,
    });

    const response =
      completion.choices[0]?.message?.content ||
      "Sorry, I couldn't generate a response";

    return NextResponse.json({ response });
  } catch (error) {
    console.error("Chat API Error:", error);
    return NextResponse.json(
      { error: "Failed to process chat request" },
      { status: 500 }
    );
  }
}
