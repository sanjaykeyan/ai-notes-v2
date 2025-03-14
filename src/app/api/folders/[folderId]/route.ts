import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";

type RouteSegment = {
  params: Promise<{
    folderId: string;
  }>;
};

export async function DELETE(
  req: Request,
  segment: RouteSegment
) {
  try {
    const { userId } = await auth();
    const { folderId } = await segment.params;
    
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Delete the folder
    await prisma.folder.delete({
      where: {
        id: folderId,
        userId, // Ensure the folder belongs to the user
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting folder:", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
