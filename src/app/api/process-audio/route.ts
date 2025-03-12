import { NextRequest, NextResponse } from 'next/server';
import { AssemblyAI } from 'assemblyai';
import Groq from 'groq-sdk';
import { writeFile, readFile, unlink } from 'fs/promises';
import path from 'path';
import os from 'os';

// Initialize clients with API keys from .env
const client = new AssemblyAI({
  apiKey: process.env.ASSEMBLYAI_API_KEY as string
});

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY as string
});

function createDefaultSummary() {
  return {
    keyInsights: ["No key insights available"],
    overview: "No meeting overview available",
    keyPoints: ["No key points available"],
    actionItems: ["No action items available"],
    decisions: ["No decisions available"],
    nextSteps: ["No next steps available"]
  };
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;
    const title = formData.get('title') as string;

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }
    console.log('Received file:', { name: file.name, size: file.size });

    // Save file temporarily
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const tempPath = path.join(os.tmpdir(), `upload-${Date.now()}-${file.name}`);
    await writeFile(tempPath, buffer);

    try {
      const fileData = await readFile(tempPath);

      // Transcribe audio
      const transcript = await client.transcripts.transcribe({
        audio: tempPath,
        speaker_labels:true
      });

      if (transcript.status !== 'completed') {
        throw new Error(`Transcription failed with status: ${transcript.status}`);
      }

      // Format transcript and timestamp mapping
      let result = '';
      const timestampMapping = [];
      if (transcript.utterances?.length) {
        for (const utterance of transcript.utterances) {
          const text = `Speaker ${utterance.speaker}: ${utterance.text}`;
          result += `${text}\n`;
          timestampMapping.push({ text, start_time: utterance.start });
        }
      } else {
        result = transcript.text || 'No transcription available';
      }

      // Truncate if necessary (consider token limit instead of hard 20k chars)
      result = result.slice(0, 20000);

      console.log('Transcription completed:', { length: result.length, utterances: transcript.utterances?.length });

      // Generate summary using Groq
      const prompt = `Based on this conversation: ${result}

Provide a structured summary in VALID JSON format. Start with 5-10 key insights that capture the most important points of the meeting, followed by a detailed breakdown.
Format STRICTLY as follows:

{
    "keyInsights": [
        "[clear, impactful point about the meeting]",
        "[key conclusion from the discussion]",
        "[important decision or outcome]"
        // 5-10 bullet points total, direct statements without prefixes
    ],
    "overview": "Write a 2-3 sentence executive summary of the meeting's main topics and outcomes.",
    "keyPoints": [
        "Important insight: [concise point with context]",
        "Critical discussion: [key topic and its significance]",
        "Notable finding: [important discovery or conclusion]"
    ],
    "actionItems": [
        "Priority task: [specific action with owner]",
        "Required follow-up: [clear next steps]",
        "Deadline item: [task with timeline]"
    ],
    "decisions": [
        "Approved: [specific decision with context]",
        "Agreement reached: [clear consensus point]",
        "Resolved: [final determination]"
    ],
    "nextSteps": [
        "Immediate action: [next step with timeline]",
        "Follow-up required: [specific follow-up item]",
        "Scheduled: [upcoming task or meeting]"
    ]
}

IMPORTANT: 
1. Key insights should be direct, clear statements without any prefixes or numbering
2. Keep key insights between 4-6 points
3. Overview should be concise but informative
4. Each bullet point should be specific and actionable
5. Use professional business language
6. Include context where relevant
7. Keep points clear and meaningful`;

      const completion = await groq.chat.completions.create({
        messages: [{ role: 'user', content: prompt }],
        model: "llama-3.3-70b-versatile",
        temperature: 0.7,
        max_tokens: 2048,
        top_p: 1,
      });

      let summary;
      const summaryText = completion.choices[0]?.message?.content || '{}';
      console.log('Raw Groq response:', summaryText);
      let summaryJson;
      const trimmedText = summaryText.trim();
      
      if (!trimmedText || !trimmedText.startsWith('{')) {
        summaryJson = createDefaultSummary();
      } else {
        try {
          summaryJson = JSON.parse(trimmedText);
        } catch (firstError) {
          const match = trimmedText.match(/```(?:json)?\s*([\s\S]*?)```/);
          if (match) {
            try {
              summaryJson = JSON.parse(match[1].trim());
            } catch (secondError) {
              console.error('Error parsing code block:', secondError);
              summaryJson = createDefaultSummary();
            }
          } else {
            console.error('Error parsing JSON:', firstError);
            summaryJson = createDefaultSummary();
          }
        }
      }
      const requiredKeys = ["keyInsights", "overview", "keyPoints", "actionItems", "decisions", "nextSteps"];
      if (!requiredKeys.every(key => key in summaryJson && (key === "overview" ? typeof summaryJson[key] === "string" : Array.isArray(summaryJson[key])))) {
          console.warn('Summary missing required keys, using default');
          summaryJson = createDefaultSummary();
        }
      summary = summaryJson;
      // Format response data like Python implementation
      const responseFormData = new FormData();
      
      // Ensure proper JSON stringification and FormData construction
      responseFormData.append('transcription', result);
      responseFormData.append('summary', JSON.stringify(summary, null, 0)); // Use compact JSON
      responseFormData.append('timestamp_mapping', JSON.stringify(timestampMapping, null, 0));
      responseFormData.append('duration', String(transcript.audio_duration ?? 0));
      responseFormData.append('title', title || 'Untitled Meeting');
      if (file) {
        responseFormData.append('file', file);
      }

      // Use proper FormData response
      const response = new Response(responseFormData);
      response.headers.set('Content-Type', 'multipart/form-data');
      console.log('Response prepared:', { transcriptionLength: result.length, summaryLength: JSON.stringify(summary).length });
      
      return NextResponse.json({
        transcription: result,
        summary: JSON.stringify(summary, null, 0),
        timestamp_mapping: JSON.stringify(timestampMapping, null, 0),
        duration: String(transcript.audio_duration ?? 0),
        title: title || 'Untitled Meeting',
      });

      
    } finally {
      // Clean up temporary file
      await unlink(tempPath).catch(e => console.error('Error removing temp file:', e));
    }
  } catch (error) {
    console.error('Error processing audio:', error instanceof Error ? { message: error.message, stack: error.stack } : error);
    return NextResponse.json(
      {
        error: 'Error processing audio',
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
}

export const config = {
  api: {
    bodyParser: false,
    responseLimit: '50mb' // Increased to handle larger responses
  }
};