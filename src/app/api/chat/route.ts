import { NextRequest, NextResponse } from 'next/server';
import Groq from 'groq-sdk';

// Initialize Groq with existing API key from .env
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY || process.env.NEXT_PUBLIC_GROQ_API_KEY,
});

export async function POST(req: NextRequest) {
  try {
    const { message, transcript, summary, messageHistory } = await req.json();

    // Convert messageHistory to Groq message format
    const previousMessages = messageHistory.map((msg: any) => ({
      role: msg.sender === 'user' ? 'user' : 'assistant',
      content: msg.text
    }));

    const systemPrompt = {
      role: "system",
      content: `You are a friendly and helpful meeting assistant. Respond naturally to greetings and only provide meeting information when specifically asked. Be concise and relevant.

Meeting Summary:
${summary}

Meeting Transcript:
${transcript}

Remember previous interactions and maintain conversation continuity.`
    };

    const completion = await groq.chat.completions.create({
      messages: [
        systemPrompt,
        ...previousMessages,
        { role: "user", content: message }
      ],
      model: "mixtral-8x7b-32768",
      temperature: 0.3, // Lowered for more focused responses
      max_tokens: 1024,
    });

    return NextResponse.json({
      response: completion.choices[0]?.message?.content || "Sorry, I couldn't process that request."
    });

  } catch (error: any) {
    console.error('Chat error:', error.message);
    return NextResponse.json(
      { error: 'Failed to process chat request. Please try again.' },
      { status: 500 }
    );
  }
}