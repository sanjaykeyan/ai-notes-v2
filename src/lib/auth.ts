import prisma from "./prisma";

export async function getOrCreateUser(
  userId: string,
  email: string,
  firstName?: string | null,
  fullName?: string | null
) {
  const user = await prisma.user.upsert({
    where: {
      id: userId,
    },
    update: {
      email: email,
      firstName: firstName || undefined,
      fullName: fullName || undefined,
    },
    create: {
      id: userId,
      email: email,
      firstName: firstName || undefined,
      fullName: fullName || undefined,
    },
  });

  return user;
}
