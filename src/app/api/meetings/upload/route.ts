import { NextResponse, NextRequest } from "next/server";
import { getAuth, clerkClient } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";
import { uploadToS3 } from "@/lib/s3";
import { sendProcessingCompleteEmail } from "@/lib/email";

export async function POST(req: NextRequest) {
  let writer: WritableStreamDefaultWriter | undefined;

  try {
    // Get authenticated user
    const { userId } = getAuth(req);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get user email using separate try-catch
    let userEmail: string | undefined;
    try {
      const client = await clerkClient();
      const user = await client.users.getUser(userId);
      const primaryEmail = user.emailAddresses.find(
        (email) => email.id === user.primaryEmailAddressId
      );
      userEmail = primaryEmail?.emailAddress;
      console.log("Found user email:", userEmail);
    } catch (clerkError) {
      console.error("Clerk error details:", {
        error: clerkError,
        userId: userId,
        stack: clerkError instanceof Error ? clerkError.stack : undefined,
      });
      // Continue without email - don't block the upload
    }

    const formData = await req.formData();
    
    console.log("Received form data entries:", Array.from(formData.entries()).map(([key, value]) => ({
      key,
      type: typeof value,
      isFile: value instanceof File
    })));

    // Get data from FormData
    const file = formData.get('file') as File;
    const title = formData.get('title') as string || 'Untitled Meeting';
    const transcription = formData.get('transcription') as string;
    const summaryStr = formData.get('summary') as string;
    const timestampMappingStr = formData.get('timestamp_mapping') as string;
    const durationStr = formData.get('duration') as string;

    // Validate required fields
    if (!transcription || !summaryStr || !timestampMappingStr) {
      throw new Error('Missing required fields');
    }

    // Upload to S3 if file exists
    let audioUrl = null;
    if (file) {
      audioUrl = await uploadToS3(file, userId);
      console.log("File uploaded to S3:", audioUrl);
    }

    // Create meeting entry
    const meeting = await prisma.meeting.create({
      data: {
        title,
        transcript: transcription,
        summary: summaryStr, // Already stringified
        duration: parseFloat(durationStr) || 0,
        timestampMapping: timestampMappingStr, // Already stringified
        recordingUrl: audioUrl,
        userId,
        isLiveRecorded: false,
      },
    });

    // Send email notification if we have a user email
    if (userEmail) {
      try {
        await sendProcessingCompleteEmail({
          email: userEmail,
          userId,
          title: title || 'Untitled Meeting',
        });
        console.log("Email notification sent successfully");
      } catch (emailError) {
        console.error("Failed to send email notification:", emailError);
        // Don't throw here - continue with the process
      }
    } else {
      console.log("No email address found for user:", userId);
    }

    return NextResponse.json({
      status: "complete",
      meeting
    });

  } catch (error) {
    console.error("Upload processing error:", error instanceof Error ? {
      message: error.message,
      stack: error.stack
    } : String(error));

    return NextResponse.json(
      {
        error: "Processing failed",
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 400 }
    );
  }
}
