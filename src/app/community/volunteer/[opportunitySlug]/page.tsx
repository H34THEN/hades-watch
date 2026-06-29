import Link from "next/link";
import { notFound } from "next/navigation";
import { CommunityNav } from "@/components/community/CommunityNav";
import { CommunitySafetyNotice } from "@/components/community/CommunitySafetyNotice";
import { CommunityShell } from "@/components/community/CommunityShell";
import { VolunteerResponseForm } from "@/components/community/VolunteerBoard";
import { TerminalPanel } from "@/components/terminal/TerminalPanel";
import { VOLUNTEER_LANES } from "@/lib/community/constants";
import { getSessionUser, isApprovedUser } from "@/lib/auth/session";
import { getVolunteerOpportunityBySlug } from "@/lib/queries/community";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ opportunitySlug: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { opportunitySlug } = await params;
  const opp = await getVolunteerOpportunityBySlug(opportunitySlug);
  return { title: opp ? `${opp.title} // Volunteer` : "Volunteer Opportunity" };
}

export default async function VolunteerDetailPage({ params }: PageProps) {
  const { opportunitySlug } = await params;
  const opportunity = await getVolunteerOpportunityBySlug(opportunitySlug);
  if (!opportunity) notFound();

  const user = await getSessionUser();
  const approved = user ? isApprovedUser(user) : false;

  return (
    <CommunityShell title={opportunity.title}>
      <CommunityNav active="/community/volunteer" />
      <Link href="/community/volunteer" className="font-mono text-xs text-muted-foreground hover:text-primary">
        ← Volunteer Board
      </Link>

      <TerminalPanel title={`volunteer.${opportunity.slug}`} className="mt-4">
        <p className="font-mono text-xs uppercase text-primary">{VOLUNTEER_LANES[opportunity.lane]}</p>
        <div className="mt-4 grid gap-2 font-mono text-[10px] text-muted-foreground sm:grid-cols-2">
          <p>Difficulty: {opportunity.difficulty ?? "—"}</p>
          <p>Time: {opportunity.estimatedTime ?? "—"}</p>
          <p>Status: {opportunity.status}</p>
          {opportunity.factionAffinity && <p>Faction: {opportunity.factionAffinity}</p>}
          {opportunity.accessLevel && <p>Access: {opportunity.accessLevel}</p>}
        </div>

        <p className="mt-4 text-sm text-muted-foreground">{opportunity.description}</p>

        {opportunity.purpose && (
          <div className="mt-4">
            <h2 className="font-mono text-xs uppercase text-primary">Purpose</h2>
            <p className="mt-1 text-sm">{opportunity.purpose}</p>
          </div>
        )}
        {opportunity.taskDescription && (
          <div className="mt-4">
            <h2 className="font-mono text-xs uppercase text-primary">Task</h2>
            <p className="mt-1 text-sm whitespace-pre-wrap">{opportunity.taskDescription}</p>
          </div>
        )}
        {opportunity.acceptanceCriteria && (
          <div className="mt-4">
            <h2 className="font-mono text-xs uppercase text-primary">Acceptance Criteria</h2>
            <p className="mt-1 text-sm">{opportunity.acceptanceCriteria}</p>
          </div>
        )}
        {opportunity.whatNotToSubmit && (
          <div className="mt-4">
            <h2 className="font-mono text-xs uppercase text-primary">Do Not Submit</h2>
            <p className="mt-1 text-sm text-amber-500/90">{opportunity.whatNotToSubmit}</p>
          </div>
        )}

        {(opportunity.badgeHookSlug || opportunity.avatarUnlockHookSlug || opportunity.reputationRewardPoints) && (
          <div className="mt-4 font-mono text-[10px] text-muted-foreground">
            {opportunity.reputationRewardPoints && opportunity.reputationCategory && (
              <p>
                Reputation: +{opportunity.reputationRewardPoints} {opportunity.reputationCategory}
              </p>
            )}
            {opportunity.badgeHookSlug && <p>Badge hook: {opportunity.badgeHookSlug}</p>}
            {opportunity.avatarUnlockHookSlug && (
              <p>Avatar unlock hook: {opportunity.avatarUnlockHookSlug}</p>
            )}
          </div>
        )}

        {opportunity.reviewRequired && (
          <p className="mt-4 font-mono text-xs text-amber-500/80">Review required before rewards apply.</p>
        )}

        <div className="mt-6 border-t border-border/40 pt-6">
          <VolunteerResponseForm opportunityId={opportunity.id} disabled={!approved} />
        </div>
      </TerminalPanel>

      <CommunitySafetyNotice />
    </CommunityShell>
  );
}
