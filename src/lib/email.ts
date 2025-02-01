import { Resend } from 'resend';
import { config } from './config';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendProcessingCompleteEmail(email: string, meetingTitle: string) {
  try {
    console.log('Sending email with Resend:', {
      to: email,
      title: meetingTitle,
      apiKey: process.env.RESEND_API_KEY?.substring(0, 8) + '...' // Log partial API key for debugging
    });

    const { data, error } = await resend.emails.send({
      from: 'Memoria AI <onboarding@resend.dev>', // Use verified Resend domain
      to: email,
      subject: 'Your meeting has been processed',
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #2563EB; margin-bottom: 20px;">Meeting Processing Complete</h1>
          <p style="font-size: 16px; line-height: 1.5; color: #374151;">
            Your meeting "${meetingTitle}" has been successfully processed.
          </p>
          <p style="font-size: 16px; line-height: 1.5; color: #374151;">
            You can now view the transcript, summary, and other insights.
          </p>
          <a href="${process.env.NEXT_PUBLIC_APP_URL}/meetings" 
             style="display: inline-block; background-color: #2563EB; color: white; 
                    padding: 12px 24px; border-radius: 6px; text-decoration: none; 
                    margin-top: 20px;">
            View Meeting
          </a>
        </div>
      `,
    });

    if (error) {
      throw new Error(error.message);
    }

    console.log('Email sent successfully:', data);
    return { success: true, data };
  } catch (error) {
    console.error('Email sending failed:', {
      error,
      email,
      title: meetingTitle,
    });
    throw error;
  }
}
