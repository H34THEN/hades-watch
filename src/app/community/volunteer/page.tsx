import { CommunityNav } from "@/components/community/CommunityNav";
import { CommunitySafetyNotice } from "@/components/community/CommunitySafetyNotice";
import { CommunityShell } from "@/components/community/CommunityShell";
import { VolunteerBoard } from "@/components/community/VolunteerBoard";
import { getSessionUser, isApprovedUser } from "@/lib/auth/session";
import { getVolunteerOpportunities } from "@/lib/queries/community";

export const metadata = {
  title: "Volunteer Board // Build the Underwatch",
};

export default async function VolunteerPage() {
  const user = await getSessionUser();
  const approved = user ? isApprovedUser(user) : false;
  const opportunities = await getVolunteerOpportunities(["OPEN", "CLAIMED", "IN_PROGRESS"]);

  return (
    <CommunityShell
      title="VOLUNTEER BOARD // BUILD THE UNDERWATCH"
      subtitle="Docs, assets, accessibility, lore, code, testing, prompts, archive work, and strange useful systems."
    >
      <CommunityNav active="/community/volunteer" />
      <VolunteerBoard opportunities={opportunities} canRespond={approved} />
      <CommunitySafetyNotice />
    </CommunityShell>
  );
}
