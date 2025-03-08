import { NextRequest, NextResponse } from "next/server";
import Groq from "groq-sdk";

// Initialize Groq with existing API key from .env
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY || process.env.NEXT_PUBLIC_GROQ_API_KEY,
});

export async function POST(req: NextRequest) {
  try {
    const { message, selectedMeetings } = await req.json();

    // TODO: Fetch relevant meeting context based on selectedMeetings
    const meetingContext = ""; // Add logic to get meeting context

    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content:
            "You are a helpful AI assistant that helps users find information in their meeting transcripts. " +
            "Provide concise and relevant answers based on the meeting context provided.",
        },
        {
          role: "user",
          content: `Context from meetings:\n${meetingContext}\n\nUser question: ${message}`,
        },
      ],
      model: "mixtral-8x7b-32768",
      temperature: 0.5,
      max_tokens: 1024,
    });

    return NextResponse.json({
      message:
        completion.choices[0]?.message?.content ||
        "Sorry, I couldn't generate a response.",
    });
  } catch (error: any) {
    console.error("Chat API Error:", error.message);
    return NextResponse.json(
      { error: "Failed to process chat request. Please try again." },
      { status: 500 }
    );
  }
}
