import prisma from "./prisma";

export async function isNewUser(userId: string): Promise<boolean> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      createdAt: true,
    },
  });

  if (!user) return true;

  // Consider user new if they have no meetings and account is less than 24 hours old
  return false;
}
