import { notFound } from "next/navigation";
import { getFactionBySlug, getUserFactionMembership } from "@/lib/actions/mmo";
import { requireAuth } from "@/lib/auth/session";
import { FactionDetailClient } from "./FactionDetailClient";

export const metadata = { title: "Faction" };

export default async function FactionDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const user = await requireAuth();
  const { slug } = await params;
  const faction = await getFactionBySlug(slug);
  if (!faction) notFound();

  const membership = await getUserFactionMembership(user.id, faction.id);

  return <FactionDetailClient faction={faction} membershipStatus={membership?.status ?? null} />;
}
