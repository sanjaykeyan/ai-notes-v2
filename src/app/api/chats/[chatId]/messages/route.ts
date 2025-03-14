import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";

type RouteSegment = {
  params: Promise<{
    chatId: string;
  }>;
};

export async function GET(
  request: NextRequest,
  segment: RouteSegment
) {
  const { userId } = await auth();
  const { chatId } = await segment.params;

  if (!userId) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const messages = await prisma.chatMessage.findMany({
      where: {
        chatId: chatId,
        chat: {
          userId: userId, // Ensure the chat belongs to the user
        },
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    return NextResponse.json(messages);
  } catch (error) {
    console.error("Error fetching messages:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
