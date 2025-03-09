import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";

export async function GET() {
  const { userId } = await auth();

  if (!userId) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const chats = await prisma.chat.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(chats);
}

export async function POST(req: Request) {
  const { userId } = await auth();

  if (!userId) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const { title, message } = await req.json();

  const chat = await prisma.chat.create({
    data: {
      title,
      userId,
      messages: message
        ? {
            create: {
              content: message,
              role: "user",
            },
          }
        : undefined,
    },
    include: {
      messages: true,
    },
  });

  return NextResponse.json(chat);
}
