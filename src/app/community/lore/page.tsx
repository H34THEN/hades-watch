import { CommunityNav } from "@/components/community/CommunityNav";
import { CommunitySafetyNotice } from "@/components/community/CommunitySafetyNotice";
import { CommunityShell } from "@/components/community/CommunityShell";
import { LoreSubmissionForm } from "@/components/community/LoreSubmissionForm";
import { LoreTierGuide } from "@/components/community/LoreTierGuide";
import { TerminalPanel } from "@/components/terminal/TerminalPanel";
import { getSessionUser, isApprovedUser } from "@/lib/auth/session";
import { getRecentLoreSubmissions } from "@/lib/queries/community";

export const metadata = {
  title: "Canon Tiers // Dead Index Authority",
};

export default async function LoreSubmissionsPage() {
  const user = await getSessionUser();
  const approved = user ? isApprovedUser(user) : false;
  const submissions = user ? await getRecentLoreSubmissions(user.id) : [];

  return (
    <CommunityShell
      title="CANON TIERS // DEAD INDEX AUTHORITY"
      subtitle="Write character, guild, and community lore without overwriting official Hades Watch canon."
    >
      <CommunityNav active="/community/lore" />
      <LoreTierGuide />
      <div className="mt-8">
        <LoreSubmissionForm
          disabled={!approved}
          lockedMessage={
            !user
              ? "Sign in to submit lore."
              : "Lore submissions open after operative approval."
          }
        />
      </div>
      {submissions.length > 0 && (
        <TerminalPanel title="lore.your-submissions" className="mt-8">
          <ul className="space-y-2 font-mono text-xs">
            {submissions.map((s) => (
              <li key={s.id} className="border-b border-border/30 pb-2">
                <span className="text-primary">{s.title}</span>
                <span className="ml-2 text-muted-foreground">
                  {s.tierRequested} · {s.status}
                </span>
              </li>
            ))}
          </ul>
        </TerminalPanel>
      )}
      <CommunitySafetyNotice />
    </CommunityShell>
  );
}
