import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { Groq } from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function GET(
  req: NextRequest,
  context: { params: { id: string } }
) {
  try {
    const meetingId = context.params.id;
    if (!meetingId) {
      return NextResponse.json({ error: "Missing meeting ID" }, { status: 400 });
    }

    // First check for existing smart filters
    const existingFilter = await prisma.smartFilter.findUnique({
      where: { meetingId },
    });

    if (existingFilter) {
      try {
        // Parse and validate the content
        const parsedContent = JSON.parse(existingFilter.content);
        return NextResponse.json({
          content: parsedContent,
          cached: true,
        });
      } catch (parseError) {
        console.error("Error parsing cached content:", parseError);
        // If cached content is invalid, delete it and continue to regenerate
        await prisma.smartFilter.delete({ where: { meetingId } });
      }
    }

    // Verify API key is present
    if (!process.env.GROQ_API_KEY) {
      console.error("GROQ_API_KEY is not configured");
      throw new Error("GROQ API key is not configured");
    }

    console.log("Looking for meeting:", meetingId);
    const meeting = await prisma.meeting.findUnique({
      where: { id: meetingId },
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
    "string dates only, display only the instances when a specific date was mentioned in the transcript"
  ],
  "metrics": [
    "metric: value pairs as strings, return only the instances when a specific metric was mentioned in the transcript"
  ],
  "tasks": [
    "task descriptions as strings, return only the instances when a specific task was mentioned in the transcript"
  ]
}
Important: All array items must be strings, not objects. Format each item as a readable string.
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
      try {
        // Clean and validate the content before saving
        const cleanedContent = content.replace(/^[\s\S]*?({[\s\S]*})[\s\S]*$/, '$1');
        const parsedContent = JSON.parse(cleanedContent);
        
        // Save the cleaned content
        await prisma.smartFilter.create({
          data: {
            meetingId,
            content: JSON.stringify(parsedContent),
          },
        });

        return NextResponse.json({
          content: parsedContent,
          cached: false,
        });
      } catch (parseError) {
        console.error("Error processing AI response:", parseError);
        throw new Error("Invalid response format from AI");
      }
    }

    throw new Error("No content received from AI");
  } catch (error: any) {
    console.error("SmartFilters Error:", error);
    return NextResponse.json(
      { error: "Failed to process transcript", details: error.message },
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
