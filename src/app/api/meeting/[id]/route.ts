import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

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
    const { id } = await segment.params;
    const meeting = await prisma.meeting.findUnique({
      where: {
        id: id,
      },
      select: {
        id: true,
        title: true,
        createdAt: true,
        duration: true,
      },
    });

    if (!meeting) {
      return NextResponse.json({ error: 'Meeting not found' }, { status: 404 });
    }

    // Don't format the duration here, just return the raw value
    return NextResponse.json(meeting);
  } catch (error) {
    console.error('Error fetching meeting:', error);
    return NextResponse.json({ error: 'Failed to fetch meeting' }, { status: 500 });
  }
}
