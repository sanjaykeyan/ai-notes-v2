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
    // First check for existing smart filters
    const existingFilter = await prisma.smartFilter.findUnique({
      where: { meetingId: params.id },
    });

    if (existingFilter) {
      console.log("Returning cached smart filters");
      return NextResponse.json({
        content: existingFilter.content,
        cached: true,
      });
    }

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
            content: `Extract information from the transcript and return ONLY a JSON object with this exact structure:
{
  "dates": [
    "string dates only"
  ],
  "metrics": [
    "metric: value pairs as strings"
  ],
  "tasks": [
    "task descriptions as strings"
  ]
}
Important: All array items must be strings, not objects. Format each item as a readable string.
Example metrics: "Revenue: $500k", "Users: 1.2M"
Example tasks: "John to review Q4 report", "Schedule follow-up meeting"
Do not include any explanatory text or descriptions.`,
          },
          {
            role: "user",
            content: meeting.transcript,
          },
        ],
        model: "mixtral-8x7b-32768",
        temperature: 0,
        max_tokens: 1000,
      })
      .catch((error) => {
        console.error("Groq API Error:", error);
        throw error;
      });

    const content = completion.choices[0]?.message?.content;

    // Save the generated filters
    if (content) {
      await prisma.smartFilter.create({
        data: {
          meetingId: params.id,
          content: content,
        },
      });
    }

    console.log("Groq API Response:", completion.choices[0]?.message);
    return NextResponse.json({
      content,
      cached: false,
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

// Add DELETE endpoint to allow clearing cached filters if needed
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.smartFilter.delete({
      where: { meetingId: params.id },
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete smart filters" },
      { status: 500 }
    );
  }
}
