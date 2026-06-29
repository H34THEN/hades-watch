import Link from "next/link";
import { CommunityModuleGrid } from "@/components/community/CommunityModuleGrid";
import { CommunityNav } from "@/components/community/CommunityNav";
import { CommunitySafetyNotice } from "@/components/community/CommunitySafetyNotice";
import { CommunityShell } from "@/components/community/CommunityShell";
import { ReputationPanel } from "@/components/community/ReputationPanel";
import { CommandButton } from "@/components/terminal/CommandButton";
import { TerminalPanel } from "@/components/terminal/TerminalPanel";
import { getSessionUser, isApprovedUser } from "@/lib/auth/session";
import { getCommunityHubStats } from "@/lib/queries/community";

export const metadata = {
  title: "Community Signals // Underwatch Commons",
  description:
    "Build the underworld together: threads, guilds, volunteer calls, lore fragments, and public signals.",
};

export default async function CommunityPage() {
  const user = await getSessionUser();
  const approved = user ? isApprovedUser(user) : false;
  const stats = await getCommunityHubStats();

  return (
    <CommunityShell
      title="COMMUNITY SIGNALS // UNDERWATCH COMMONS"
      subtitle="Build the underworld together: threads, guilds, volunteer calls, lore fragments, and public signals."
    >
      <CommunityNav active="/community" />

      {!user && (
        <TerminalPanel title="clearance.required" className="mb-8" status="warning">
          <p className="font-mono text-sm text-muted-foreground">
            Sign in to post, submit signals, join guilds, or volunteer. Public landing
            remains readable.
          </p>
          <Link href="/login" className="mt-4 inline-block">
            <CommandButton size="sm">Sign In</CommandButton>
          </Link>
        </TerminalPanel>
      )}

      {user && !approved && (
        <TerminalPanel title="clearance.pending" className="mb-8" status="warning">
          <p className="font-mono text-sm text-muted-foreground">
            Community posting opens after operative approval.
          </p>
          <Link href="/pending-approval" className="mt-4 inline-block">
            <CommandButton size="sm" variant="outline">
              Check Clearance
            </CommandButton>
          </Link>
        </TerminalPanel>
      )}

      {user && approved && (
        <div className="mb-8">
          <ReputationPanel userId={user.id} />
        </div>
      )}

      <CommunityModuleGrid stats={stats} />

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        <TerminalPanel title="relay.chat">
          <p className="text-sm text-muted-foreground">
            Temporary signal rooms for approved operatives. Good for chatter, bad for
            secrets.
          </p>
          <p className="mt-2 font-mono text-[10px] text-muted-foreground">
            HTTPS-protected temporary chat. No secrets. No archives.
          </p>
          <Link href="/chat" className="mt-4 inline-block">
            <CommandButton size="sm" variant="outline">
              Enter Chat
            </CommandButton>
          </Link>
        </TerminalPanel>
        <TerminalPanel title="relay.neighbors">
          <p className="text-sm text-muted-foreground">
            Small doors in the Underwatch wall. Old-web banner exchange and neighbor
            scouting.
          </p>
          <Link href="/net-neighbors" className="mt-4 inline-block">
            <CommandButton size="sm" variant="outline">
              Net Neighbors
            </CommandButton>
          </Link>
        </TerminalPanel>
      </div>

      <CommunitySafetyNotice />
    </CommunityShell>
  );
}
