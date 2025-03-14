"use client";
import { ShareButton } from "@/app/components/ShareButton";
import type { ShareMethod } from "@/app/components/ShareButton";

interface SummaryObject {
  content?: string;
}

interface ShareMeetingButtonProps {
  meetingId: string;
  meetingTitle: string;
  summary?: string | SummaryObject;
  duration?: string;
  createdAt?: string;
  className?: string;
  iconOnly?: boolean;
}

export function ShareMeetingButton({
  meetingId,
  meetingTitle,
  summary,
  duration,
  createdAt,
  className,
  iconOnly
}: ShareMeetingButtonProps) {
  const handleShare = async (method: ShareMethod) => {
    try {
      const meetingUrl = `${window.location.origin}/meetings/${meetingId}`;
      const title = meetingTitle || 'Untitled Meeting';
      const encodedUrl = encodeURIComponent(meetingUrl);
      const encodedTitle = encodeURIComponent(title);

      switch (method) {
        case 'whatsapp':
          window.open(`https://wa.me/?text=${encodedTitle}%0A${encodedUrl}`, '_blank');
          break;
        case 'email':
          window.open(`mailto:?subject=${encodedTitle}&body=${encodeURIComponent(`Please find the meeting summary at:\n${meetingUrl}`)}`, '_blank');
          break;
        case 'linkedin':
          window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`, '_blank');
          break;
        case 'teams':
          window.open(`https://teams.microsoft.com/share?url=${encodedUrl}&text=${encodedTitle}`, '_blank');
          break;
        case 'slack':
          // Slack doesn't have a direct share URL, we'll copy to clipboard instead
          await navigator.clipboard.writeText(`${title}\n${meetingUrl}`);
          alert('Link copied to clipboard! You can now paste it in Slack.');
          break;
        case 'telegram':
          window.open(`https://t.me/share/url?url=${encodedUrl}&text=${encodedTitle}`, '_blank');
          break;
        case 'download':
          if (!summary) {
            console.error('No summary available for download');
            alert('No summary available for this meeting');
            return;
          }
          
          try {
            let summaryData;
            try {
              // Handle different summary formats
              if (typeof summary === 'string') {
                summaryData = JSON.parse(summary);
              } else if (summary && typeof summary === 'object' && 'content' in summary) {
                summaryData = JSON.parse(summary.content || '{}');
              } else {
                throw new Error('Invalid summary format');
              }

              // Log for debugging
              console.log('Final summary data:', summaryData);

              if (!summaryData || typeof summaryData !== 'object') {
                throw new Error('Invalid summary data format');
              }
            } catch (parseError) {
              console.error('Error parsing summary:', parseError);
              alert('Invalid summary format');
              return;
            }

            const response = await fetch(`/api/generate-pdf`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                summary: summaryData,
                meetingDetails: {
                  title: meetingTitle || 'Untitled_Meeting',
                  duration: duration || '0', // Changed: pass raw duration value
                  date: new Date(createdAt || Date.now()).toLocaleString(),
                  generatedAt: new Date().toLocaleString(),
                }
              }),
            });

            if (!response.ok) throw new Error('Failed to generate PDF');
            const blob = await response.blob();
            const pdfUrl = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = pdfUrl;
            // Changed: Preserve case while replacing invalid characters
            a.download = `${meetingTitle.replace(/[^a-zA-Z0-9]/gi, '_')}_summary.pdf`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(pdfUrl);
          } catch (error) {
            console.error('PDF generation failed:', error);
            alert('Failed to generate PDF. Please try again.');
          }
          break;
      }
    } catch (error) {
      console.error('Error sharing meeting:', error);
      alert('Failed to share. Please try again.');
    }
  };

  return <ShareButton onShare={handleShare} className={className} iconOnly={iconOnly} />;
}
