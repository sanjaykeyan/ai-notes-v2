import { NextRequest, NextResponse } from 'next/server';
import { Groq } from "groq-sdk";

const GROQ_API_KEY = "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";

export async function POST(request: NextRequest) {
  try {
    const { insight, transcript } = await request.json();

    const prompt = `Based on this conversation transcript: ${transcript}

For this key insight: "${insight}"

Generate 2-3 supporting points that expand on this insight. Each point should:
- Be one complete, clear sentence
- Add specific context or detail from the discussion
- Be around 15-25 words long
- Stay focused and relevant to the insight

Format the response as a JSON array:
{
  "expandedPoints": [
    "A clear sentence that provides specific context about the insight",
    "Another complete sentence explaining a related aspect from the discussion",
    "Optional third sentence with additional relevant information"
  ]
}`;

    const client = new Groq({
      apiKey: GROQ_API_KEY,
    });

    const completion = await client.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 1024,
      top_p: 1,
    });

    const content = completion.choices[0]?.message?.content;
    if (!content) {
      throw new Error('No content received from Groq API');
    }

    try {
      const result = JSON.parse(content);
      return NextResponse.json(result);
    } catch (parseError) {
      console.error('Error parsing Groq API response:', parseError);
      throw new Error('Invalid JSON response from Groq API');
    }
  } catch (error) {
    console.error('Error expanding insight:', error);
    return NextResponse.json(
      { 
        error: 'Failed to expand insight',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
