import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { formatDuration } from '@/lib/utils';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const meeting = await prisma.meeting.findUnique({
      where: {
        id: params.id,
      },
      select: {
        id: true,
        title: true,
        duration: true,
        createdAt: true,
      },
    });

    if (!meeting) {
      return NextResponse.json({ error: 'Meeting not found' }, { status: 404 });
    }

    // Parse duration and ensure it's a number
    let durationInSeconds: number;
    
    // Check if duration is a string that might be storing milliseconds
    if (typeof meeting.duration === 'string') {
      // Convert potential milliseconds to seconds
      durationInSeconds = Math.floor(Number(meeting.duration) / 1000);
    } else {
      durationInSeconds = Number(meeting.duration);
    }

    // Format the duration before sending the response
    const formattedMeeting = {
      ...meeting,
      duration: formatDuration(durationInSeconds)
    };

    return NextResponse.json(formattedMeeting);
  } catch (error) {
    console.error('Error fetching meeting:', error);
    return NextResponse.json({ error: 'Failed to fetch meeting' }, { status: 500 });
  }
}
