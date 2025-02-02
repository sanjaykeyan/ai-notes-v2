import { NextResponse,NextRequest } from "next/server";
import { getAuth, clerkClient } from '@clerk/nextjs/server'
import prisma from "@/lib/prisma";
import { uploadToS3 } from "@/lib/s3";
import { sendProcessingCompleteEmail } from '@/lib/email';

export async function POST(req: NextRequest) {
  let writer: WritableStreamDefaultWriter | undefined;
  
  try {
    // Get authenticated user
    const { userId } = getAuth(req)
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get user email using separate try-catch
    let userEmail: string | undefined;
    try {
      const client = await clerkClient()
      const user = await client.users.getUser(userId)
      const primaryEmail = user.emailAddresses.find(
        email => email.id === user.primaryEmailAddressId
      );
      userEmail = primaryEmail?.emailAddress;
      console.log("Found user email:", userEmail);
    } catch (clerkError) {
      console.error("Clerk error details:", {
        error: clerkError,
        userId: userId,
        stack: clerkError instanceof Error ? clerkError.stack : undefined
      });
      // Continue without email - don't block the upload
    }

    const formData = await req.formData();
    const file = formData.get("file") as File;
    const title = formData.get("title") as string;

    if (!file || !title) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Upload to S3 first
    const audioUrl = await uploadToS3(file, userId);

    // First response to indicate upload complete
    const uploadStream = new TransformStream();
    writer = uploadStream.writable.getWriter();
    const encoder = new TextEncoder();

    const responseStream = new Response(uploadStream.readable, {
      headers: { "Content-Type": "text/event-stream" },
    });

    // Send "uploading complete" message
    writer.write(encoder.encode('data: {"status": "processing"}\n\n'));

    // Send to Flask server
    const flaskResponse = await fetch("http://127.0.0.1:5000/upload", {
      method: "POST",
      body: formData,
    });

    if (!flaskResponse.ok) {
      throw new Error(`Flask server error: ${flaskResponse.statusText}`);
    }

    const { transcription, summary, timestamp_mapping,duration} = await flaskResponse.json();

    // Store in database with audioUrl
    const meeting = await prisma.meeting.create({
      data: {
        title,
        transcript: transcription,
        summary,
        duration:duration,
        timestampMapping: timestamp_mapping,
        recordingUrl: audioUrl, // Store the S3 URL
        userId,
      },
    });

    // When sending email, add better error handling
    if (userEmail) {
      try {
        console.log("Attempting to send email to:", userEmail);
        const emailResult = await sendProcessingCompleteEmail(userEmail, title);
        console.log("Email sent successfully:", emailResult);
      } catch (emailError) {
        console.error("Email sending failed:", {
          error: emailError,
          email: userEmail,
          userId,
          title
        });
        // Don't throw here - continue with the process
      }
    } else {
      console.log("No email address found for user:", userId);
    }

    writer.write(
      encoder.encode(
        `data: {"status": "complete", "meeting": ${JSON.stringify(
          meeting
        )}}\n\n`
      )
    );
    writer.close();

    return responseStream;
  } catch (error) {
    // Clean up resources
    if (writer) {
      try {
        await writer.close();
      } catch (closeError) {
        console.error("Error closing writer:", closeError);
      }
    }

    // Properly format error response
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    console.error("Upload processing error:", errorMessage);
    
    return NextResponse.json({
      error: "Processing failed",
      details: errorMessage
    }, { 
      status: 500 
    });
  }
}
