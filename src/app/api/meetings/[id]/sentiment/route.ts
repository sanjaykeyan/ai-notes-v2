import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { Groq } from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY!,
});

function cleanAndValidateJSON(text: string): string {
  // Remove any potential BOM or hidden characters
  text = text.replace(/^\uFEFF/, "");

  // Remove any potential markdown formatting
  text = text.replace(/```json/g, "").replace(/```/g, "");

  // Clean up whitespace and ensure proper JSON structure
  text = text.trim();

  // Attempt to parse and re-stringify to ensure valid JSON
  try {
    const parsed = JSON.parse(text);
    return JSON.stringify(parsed);
  } catch (e) {
    throw new Error(`Invalid JSON structure: ${e.message}`);
  }
}

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const sentiment = await prisma.sentiment.findUnique({
      where: {
        meetingId: params.id,
      },
    });

    // Always return a properly formatted JSON response
    return NextResponse.json({
      success: true,
      analysis: sentiment?.analysis || null,
    });
  } catch (error) {
    console.error("Error fetching sentiment:", error);
    return NextResponse.json({
      success: false,
      error: "Failed to fetch sentiment analysis",
      analysis: null,
    });
  }
}

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Get meeting transcript
    const meeting = await prisma.meeting.findUnique({
      where: {
        id: params.id,
      },
      select: {
        transcript: true,
      },
    });

    if (!meeting?.transcript) {
      return NextResponse.json({
        success: false,
        error: "No transcript found for this meeting",
        analysis: null,
      });
    }

    // Generate sentiment analysis using Groq
    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: `You are a concise meeting analyst. Provide brief, impactful insights using 1-2 clear sentences per insight.`,
        },
        {
          role: "user",
          content: `Analyze this transcript and provide a focused analysis in this exact JSON format:

{
  "overallTone": {
    "tone": "<ONE of: Professional/Casual/Tense/Friendly/Formal>",
    "description": "<Single sentence about tone, max 12 words>"
  },
  "keyMoments": [
    {
      "moment": "<Key point in 8-10 words>",
      "sentiment": "<Emotion word> - <5-7 word description>"
    }
  ],
  "participantEngagement": [
    {
      "observation": "<Single participation insight in 8-10 words>",
      "level": "<ONE of: High/Medium/Low>"
    }
  ],
  "agreementAreas": [
    "<Single agreement point in 5-7 words>"
  ],
  "disagreementAreas": [
    "<Single disagreement point in 5-7 words>"
  ],
  "communicationDynamics": {
    "patterns": [
      "<Single pattern observation in 6-8 words>"
    ],
    "suggestions": [
      "<Single actionable suggestion in 6-8 words>"
    ]
  }
}

Requirements:
- Limit each array to maximum 2 items
- Keep all text extremely concise
- Use active voice
- Focus on strongest points only
- No generic statements
- No long explanations

Transcript: ${meeting.transcript}`,
        },
      ],
      model: "llama-3.3-70b-versatile",
      temperature: 0.1,
      max_tokens: 800,
    });

    let analysis = completion.choices[0]?.message?.content;

    if (!analysis) {
      return NextResponse.json({
        success: false,
        error: "Failed to generate analysis",
        analysis: null,
      });
    }

    // Clean and validate the JSON before saving
    try {
      analysis = cleanAndValidateJSON(analysis);

      // Additional validation that the structure matches our expected format
      const parsed = JSON.parse(analysis);
      if (
        !parsed.overallTone ||
        !parsed.keyMoments ||
        !parsed.participantEngagement
      ) {
        throw new Error("Missing required fields in analysis");
      }
    } catch (e) {
      console.error("JSON validation failed:", e, "Raw analysis:", analysis);
      return NextResponse.json({
        success: false,
        error: "Generated analysis was not in the correct format",
        analysis: null,
      });
    }

    // Save to database
    const sentiment = await prisma.sentiment.upsert({
      where: {
        meetingId: params.id,
      },
      update: {
        analysis,
      },
      create: {
        meetingId: params.id,
        analysis,
      },
    });

    // Validate the stored analysis one more time before sending
    try {
      JSON.parse(sentiment.analysis);
      return NextResponse.json({
        success: true,
        analysis: sentiment.analysis,
      });
    } catch (e) {
      throw new Error("Stored analysis is not valid JSON");
    }
  } catch (error) {
    console.error("Error generating sentiment analysis:", error);
    return NextResponse.json({
      success: false,
      error: "Failed to generate sentiment analysis",
      analysis: null,
    });
  }
}
