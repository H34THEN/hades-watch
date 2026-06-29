import { CommunityNav } from "@/components/community/CommunityNav";
import { CommunitySafetyNotice } from "@/components/community/CommunitySafetyNotice";
import { CommunityShell } from "@/components/community/CommunityShell";
import { GuildList } from "@/components/community/GuildList";
import { GuildRequestForm } from "@/components/community/GuildRequestForm";
import { getSessionUser, isApprovedUser } from "@/lib/auth/session";
import { getApprovedGuilds } from "@/lib/queries/community";

export const metadata = {
  title: "Guilds // Underwatch Cells",
};

export default async function GuildsPage() {
  const user = await getSessionUser();
  const approved = user ? isApprovedUser(user) : false;
  const guilds = await getApprovedGuilds({
    viewerUserId: user?.id,
    viewerIsApproved: approved,
  });

  return (
    <CommunityShell
      title="GUILDS // UNDERWATCH CELLS"
      subtitle="Form a circle, gather your signals, and build something the surface cannot flatten."
    >
      <CommunityNav active="/community/guilds" />
      {approved && (
        <div className="mb-8">
          <GuildRequestForm />
        </div>
      )}
      <GuildList guilds={guilds} />
      {!approved && (
        <p className="mt-6 font-mono text-xs text-muted-foreground">
          Guild creation and membership requests require approved operative clearance.
        </p>
      )}
      <CommunitySafetyNotice />
    </CommunityShell>
  );
}
