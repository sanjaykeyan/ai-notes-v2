import prisma from '@/lib/prisma';
import { notFound } from 'next/navigation';

async function getMeeting(id: string) {
  const meeting = await prisma.meeting.findUnique({
    where: { id },
    select: {
      id: true,
      title: true,
      transcript: true,
      summary: true,
      createdAt: true,
    },
  });
  
  if (!meeting) notFound();
  return meeting;
}

export default async function MeetingPage({ 
  params 
}: { 
  params: { id: string } 
}) {
  const meeting = await getMeeting(params.id);

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl p-8">
        <h1 className="text-3xl font-semibold mb-6">
          {meeting.title || 'Untitled Meeting'}
        </h1>

        {/* Summary Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Summary</h2>
          <div className="bg-gray-50 rounded-lg p-6">
            {meeting.summary}
          </div>
        </div>

        {/* Transcript Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Transcript</h2>
          <div className="bg-gray-50 rounded-lg p-6 whitespace-pre-wrap">
            {meeting.transcript}
          </div>
        </div>

        <div className="text-sm text-gray-500">
          Created: {new Date(meeting.createdAt).toLocaleString()}
        </div>
      </div>
    </main>
  );
}