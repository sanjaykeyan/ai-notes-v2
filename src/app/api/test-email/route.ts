import { NextResponse } from 'next/server';
import { sendProcessingCompleteEmail } from '@/lib/email';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json({ 
        error: 'Email is required' 
      }, { status: 400 });
    }

    console.log('Testing email with:', {
      email,
      resendKey: process.env.RESEND_API_KEY ? 'Present' : 'Missing'
    });

    const result = await sendProcessingCompleteEmail(email, 'Test Meeting');
    
    return NextResponse.json({
      success: true,
      result,
      message: `Email sent to ${email}`
    });
  } catch (error) {
    console.error('Test email failed:', {
      error,
      stack: error instanceof Error ? error.stack : undefined
    });
    
    return NextResponse.json({ 
      error: 'Failed to send test email',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { 
      status: 500 
    });
  }
}
