import { notFound } from "next/navigation";
import { CommunityNav } from "@/components/community/CommunityNav";
import { CommunityShell } from "@/components/community/CommunityShell";
import { GuildDetailView } from "@/components/community/GuildDetailView";
import { getSessionUser, isApprovedUser } from "@/lib/auth/session";
import { getGuildBySlug } from "@/lib/queries/community";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ guildSlug: string }>;
}) {
  const { guildSlug } = await params;
  const guild = await getGuildBySlug(guildSlug);
  return { title: guild ? `${guild.name} // Guild` : "Guild" };
}

export default async function GuildDetailPage({
  params,
}: {
  params: Promise<{ guildSlug: string }>;
}) {
  const { guildSlug } = await params;
  const guild = await getGuildBySlug(guildSlug);
  if (!guild) notFound();

  const user = await getSessionUser();
  const approved = user ? isApprovedUser(user) : false;

  const isVisible =
    guild.status === "APPROVED" ||
    (user && guild.founderId === user.id);

  if (!isVisible) notFound();

  const membership = user
    ? guild.memberships.find((m) => m.userId === user.id)
    : undefined;

  return (
    <CommunityShell title={guild.name}>
      <CommunityNav active="/community/guilds" />
      <GuildDetailView
        guild={guild}
        currentUserId={user?.id}
        membershipStatus={membership?.status ?? null}
        canJoin={approved && guild.status === "APPROVED" && !membership}
      />
    </CommunityShell>
  );
}
