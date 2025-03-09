import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";

export async function DELETE(
  req: Request,
  { params }: { params: { folderId: string } }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Delete the folder
    await prisma.folder.delete({
      where: {
        id: params.folderId,
        userId, // Ensure the folder belongs to the user
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting folder:", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
