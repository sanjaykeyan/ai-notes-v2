'use client'

import dynamic from 'next/dynamic';
import { Meeting } from '@prisma/client';

const MobileDashboard = dynamic(() => import('./MobileDashboard'), {
  ssr: false
});

interface MobileDashboardWrapperProps {
  firstName: string;
  recentMeetings: Meeting[];
}

export default function MobileDashboardWrapper({ firstName, recentMeetings }: MobileDashboardWrapperProps) {
  return <MobileDashboard firstName={firstName} recentMeetings={recentMeetings} />;
}
