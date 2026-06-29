import { prisma } from "@/lib/prisma";

export interface AuthorDisplay {
  userId: string;
  displayName: string;
  callsign: string | null;
}

export async function getAuthorDisplay(userId: string): Promise<AuthorDisplay | null> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      character: { select: { callsign: true } },
    },
  });

  if (!user) {
    return null;
  }

  const callsign = user.character?.callsign ?? null;
  const displayName =
    callsign ?? user.name ?? user.email.split("@")[0] ?? "operative";

  return {
    userId: user.id,
    displayName,
    callsign,
  };
}
