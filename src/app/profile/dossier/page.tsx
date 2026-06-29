import { CharacterDossierPage } from "@/components/profile/CharacterDossierPage";
import { requireAuth, isApprovedUser } from "@/lib/auth/session";
import { getDossierForUser } from "@/lib/queries/dossier";
import { getProfileWorldForUser } from "@/lib/queries/profile-world";
import { prisma } from "@/lib/prisma";

export const metadata = { title: "Character Dossier" };

export default async function DossierRoutePage() {
  const user = await requireAuth();
  const [dossier, world, character] = await Promise.all([
    getDossierForUser(user.id),
    getProfileWorldForUser(user.id, { viewerId: user.id }),
    prisma.character.findUnique({
      where: { userId: user.id },
      select: { callsign: true, bio: true, isPublic: true, archetype: true },
    }),
  ]);

  return (
    <CharacterDossierPage
      dossier={dossier}
      world={world}
      character={character}
      isApproved={isApprovedUser(user)}
    />
  );
}
