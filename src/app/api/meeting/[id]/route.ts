import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

<<<<<<< HEAD
=======

>>>>>>> 301da49a258d902a68bf9dbb9601c1b2494931a0
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
<<<<<<< HEAD
        createdAt: true,
        duration: true,
=======
        duration: true,
        createdAt: true,
>>>>>>> 301da49a258d902a68bf9dbb9601c1b2494931a0
      },
    });

    if (!meeting) {
      return NextResponse.json({ error: 'Meeting not found' }, { status: 404 });
    }

<<<<<<< HEAD
    // Don't format the duration here, just return the raw value
    return NextResponse.json(meeting);
=======
    return NextResponse.json({
      id: meeting.id,
      title: meeting.title,
      duration: meeting.duration,
      createdAt: meeting.createdAt
    });
>>>>>>> 301da49a258d902a68bf9dbb9601c1b2494931a0
  } catch (error) {
    console.error('Error fetching meeting:', error);
    return NextResponse.json({ error: 'Failed to fetch meeting' }, { status: 500 });
  }
}
