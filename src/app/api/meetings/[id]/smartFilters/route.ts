import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { Groq } from "groq-sdk";
import { auth } from "@clerk/nextjs/server";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

type RouteSegment = {
  params: Promise<{
    id: string;
  }>;
};

export async function GET(
  request: Request,
  segment: RouteSegment
) {
  try {
    const { userId } = await auth();
    const { id } = await segment.params;
    
    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized - No user ID found" }, 
        { status: 401 }
      );
    }

    // Verify meeting ownership
    const meeting = await prisma.meeting.findUnique({
      where: { 
        id: id,
        userId: userId // Add this to ensure user owns the meeting
      },
      select: { 
        transcript: true,
        userId: true 
      },
    });

    if (!meeting) {
      return NextResponse.json(
        { error: "Meeting not found or unauthorized access" }, 
        { status: 404 }
      );
    }

    // Check if user is pro
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { isPro: true },
    });

    if (!user?.isPro) {
      return NextResponse.json(
        { error: "Pro subscription required" },
        { status: 403 }
      );
    }

    // Check for existing smart filters
    const existingFilter = await prisma.smartFilter.findUnique({
      where: { meetingId: id },
      select: {
        content: true,
        createdAt: true,
      },
    });

    if (existingFilter) {
      try {
        const parsed = JSON.parse(existingFilter.content);
        // Validate the structure of cached data
        if (
          parsed &&
          Array.isArray(parsed.dates) &&
          Array.isArray(parsed.metrics) &&
          Array.isArray(parsed.tasks)
        ) {
          console.log("Using cached smart filters from database");
          return NextResponse.json({
            content: parsed,
            cached: true,
            cachedAt: existingFilter.createdAt,
          });
        }
        // If validation fails, delete invalid cache
        await prisma.smartFilter.delete({ where: { meetingId: id } });
      } catch (e) {
        await prisma.smartFilter.delete({ where: { meetingId: id } });
      }
    }

    // Verify API key is present
    if (!process.env.GROQ_API_KEY) {
      console.error("GROQ_API_KEY is not configured");
      throw new Error("GROQ API key is not configured");
    }

    console.log("Looking for meeting:", id);
    const meetingData = await prisma.meeting.findUnique({
      where: { id: id },
      select: { transcript: true },
    });

    if (!meetingData) {
      console.log("Meeting not found");
      return NextResponse.json({ error: "Meeting not found" }, { status: 404 });
    }

    if (!meetingData.transcript) {
      console.log("Transcript is empty");
      return NextResponse.json(
        { error: "Transcript not found" },
        { status: 404 }
      );
    }

    console.log("Generating new smart filters...");
    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: `You are a precise JSON generator. Extract information from the transcript and return ONLY a JSON object with exactly this structure, nothing else:
{
  "dates": ["April 15, 2024", "Next Monday"],
  "metrics": ["Revenue: $500k", "Users: 1000"],
  "tasks": ["Submit report by Friday", "Call the client"]
}

Rules:
- Dates array: Include only specific dates or clear time references
- Metrics array: Include only numerical data with context
- Tasks array: Include only clear action items or commitments
- Use empty arrays [] if nothing found for a category
- No explanations or additional text
- No nested objects, only string arrays
- Keep string formats consistent and simple`,
        },
        {
          role: "user",
          content: meetingData.transcript,
        },
      ],
      model: "llama-3.3-70b-versatile",
      temperature: 0, // Set to 0 for maximum consistency
      max_tokens: 1000,
    });

    const content = completion.choices[0]?.message?.content;
    console.log("Raw API response content:", content);

    if (!content) {
      console.error("No content received from API");
      return NextResponse.json(
        { error: "No content received from API" },
        { status: 500 }
      );
    }

    try {
      // Remove any potential explanatory text before or after the JSON
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      const jsonContent = jsonMatch ? jsonMatch[0] : content;

      // Clean the JSON string
      const cleaned = jsonContent.trim().replace(/[\n\r]/g, " ");
      console.log("Cleaned content:", cleaned);

      let parsed;
      try {
        parsed = JSON.parse(cleaned);
      } catch (parseError) {
        console.error("Parse error:", parseError);
        console.error("Content that failed to parse:", cleaned);

        // Attempt to fix common JSON issues
        const fixedContent = cleaned
          .replace(/,\s*}/g, "}") // Remove trailing commas
          .replace(
            /([{,]\s*)"([^"]+)":\s*([^"\[\{][^,}\]]*)([,}])/g,
            '$1"$2":"$3"$4'
          ); // Quote unquoted values

        try {
          parsed = JSON.parse(fixedContent);
          console.log("Parsed after fixing:", parsed);
        } catch (e) {
          return NextResponse.json(
            { error: "Failed to parse API response", details: cleaned },
            { status: 500 }
          );
        }
      }

      // Validate and transform the structure
      const validated = {
        dates: Array.isArray(parsed?.dates) ? parsed.dates : [],
        metrics: Array.isArray(parsed?.metrics) ? parsed.metrics : [],
        tasks: Array.isArray(parsed?.tasks) ? parsed.tasks : [],
      };

      console.log("Validated content:", validated);

      // Store the validated JSON
      await prisma.smartFilter.create({
        data: {
          meetingId: id,
          content: JSON.stringify(validated),
        },
      });

      return NextResponse.json({
        content: validated,
        cached: false,
      });
    } catch (error) {
      console.error("Processing error:", error);
      console.error("Problematic content:", content);
      return NextResponse.json(
        {
          error: "Failed to process API response",
          details: error instanceof Error ? error.message : "Unknown error",
        },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error("Auth error:", error);
    return NextResponse.json(
      {
        error: "Authentication failed",
        details: error.message,
      },
      { status: 401 }
    );
  }
}

// Add DELETE endpoint to allow clearing cached filters if needed
export async function DELETE(
  request: Request,
  segment: RouteSegment
) {
  try {
    const { id } = await segment.params;
    await prisma.smartFilter.delete({
      where: { meetingId: id },
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete smart filters" },
      { status: 500 }
    );
  }
}
