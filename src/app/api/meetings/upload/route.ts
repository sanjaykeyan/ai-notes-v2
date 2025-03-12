import { NextResponse, NextRequest } from "next/server";
import { getAuth, clerkClient } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";
import { uploadToS3 } from "@/lib/s3";
import { sendProcessingCompleteEmail } from "@/lib/email";

export async function POST(req: NextRequest) {
  try {
    const { userId } = getAuth(req);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    let user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      const clerkUser = await (await clerkClient()).users.getUser(userId);
      const primaryEmail = clerkUser.emailAddresses.find(
        (email) => email.id === clerkUser.primaryEmailAddressId
      );
      user = await prisma.user.create({
        data: {
          id: userId,
          email: primaryEmail?.emailAddress || `${userId}@example.com`,
          firstName: clerkUser.firstName || 'Unknown', // Default if null
          fullName: `${clerkUser.firstName || 'Unknown'} ${clerkUser.lastName || ''}`.trim() || 'Unknown User', // Ensure non-empty
        },
      });
    }

    const formData = await req.formData();
    console.log("Received form data:", Array.from(formData.entries()));

    const file = formData.get('file') as File;
    const title = formData.get('title') as string || 'Untitled Meeting';
    const transcription = formData.get('transcription') as string;
    const summaryStr = formData.get('summary') as string;
    const timestampMappingStr = formData.get('timestamp_mapping') as string;
    const durationStr = formData.get('duration') as string;

    if (!transcription || !summaryStr || !timestampMappingStr) {
      throw new Error('Missing required fields');
    }

    let audioUrl = null;
    if (file) {
      audioUrl = await uploadToS3(file, userId);
      console.log("File uploaded to S3:", audioUrl);
    }

    const meeting = await prisma.meeting.create({
      data: {
        title,
        transcript: transcription,
        summary: summaryStr,
        duration: parseFloat(durationStr) || 0,
        timestampMapping: timestampMappingStr,
        recordingUrl: audioUrl,
        userId: user.id,
        isLiveRecorded: false,
      },
    });

    let userEmail = user.email; // Use DB email if available
    if (!userEmail) {
      try {
        const clerkUser = await clerkClient().users.getUser(userId);
        userEmail = clerkUser.emailAddresses.find(
          (email) => email.id === clerkUser.primaryEmailAddressId
        )?.emailAddress;
        console.log("Found user email from Clerk:", userEmail);
      } catch (clerkError) {
        console.error("Clerk error:", clerkError);
      }
    }

    if (userEmail) {
      try {
        await sendProcessingCompleteEmail(userEmail, title);
        console.log("Email notification sent successfully");
      } catch (emailError) {
        console.error("Failed to send email notification:", emailError);
      }
    }

    return NextResponse.json({ status: "complete", meeting });
  } catch (error) {
    console.error("Upload processing error:", error instanceof Error ? { message: error.message, stack: error.stack } : String(error));
    return NextResponse.json(
      { error: "Processing failed", details: error instanceof Error ? error.message : String(error) },
      { status: 400 }
    );
  }
}