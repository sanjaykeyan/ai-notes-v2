import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

type RouteSegment = {
  params: Promise<{
    chatId: string;
  }>;
};

export async function DELETE(
  request: NextRequest,
  segment: RouteSegment
) {
  try {
    const { userId } = await auth();
    const { chatId } = await segment.params;
    
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Delete the chat and its associated messages
    await prisma.chat.delete({
      where: {
        id: chatId,
        userId: userId,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting chat:", error);
    return NextResponse.json(
      { error: "Failed to delete chat" },
      { status: 500 }
    );
  }
}
