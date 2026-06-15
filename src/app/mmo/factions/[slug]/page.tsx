import { notFound } from "next/navigation";
import { getAlliance, getFactionBySlug, getUserFactionMembership } from "@/lib/actions/mmo";
import { getSessionUser } from "@/lib/auth/session";
import { isAdmin, isOwner } from "@/lib/auth/roles";
import { MmoNav } from "@/components/mmo/MmoNav";
import { AllianceOriginDossier } from "@/components/factions/AllianceOriginDossier";
import { FactionDetailClient } from "./FactionDetailClient";

export const metadata = { title: "The Chthonic Uprising" };

export default async function FactionDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const user = await getSessionUser();
  const { slug } = await params;

  if (slug === "chthonic-uprising") {
    const alliance = await getAlliance();
    if (!alliance) notFound();
    return (
      <div className="mx-auto max-w-4xl px-4 py-16">
        <MmoNav active="/mmo/factions" />
        <p className="mb-2 font-mono text-[10px] tracking-[0.35em] text-primary/80 uppercase">
          Alliance Origin Dossier
        </p>
        <h1 className="mb-6 font-mono text-3xl tracking-widest uppercase text-primary">
          {alliance.name}
        </h1>
        {alliance.tagline && (
          <p className="mb-6 font-mono text-sm italic text-muted-foreground">
            &ldquo;{alliance.tagline}&rdquo;
          </p>
        )}
        <AllianceOriginDossier
          alliance={alliance}
          showAdminLink={user ? isAdmin(user.roles) : false}
          showOwnerLink={user ? isOwner(user.roles) : false}
        />
      </div>
    );
  }

  const faction = await getFactionBySlug(slug);
  if (!faction) notFound();

  const membership =
    user && faction.id
      ? await getUserFactionMembership(user.id, faction.id)
      : null;

  return (
    <FactionDetailClient
      faction={faction}
      membershipStatus={membership?.status ?? null}
      isAdmin={user ? isAdmin(user.roles) : false}
      canRequestJoin={!!faction.id && !!user}
    />
  );
}
