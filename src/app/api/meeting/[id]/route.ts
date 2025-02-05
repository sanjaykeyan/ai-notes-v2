import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';


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

    return NextResponse.json({
      id: meeting.id,
      title: meeting.title,
      duration: meeting.duration,
      createdAt: meeting.createdAt
    });
  } catch (error) {
    console.error('Error fetching meeting:', error);
    return NextResponse.json({ error: 'Failed to fetch meeting' }, { status: 500 });
  }
}
