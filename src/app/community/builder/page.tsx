import { CommunityBuilderForm } from "@/components/community/CommunityBuilderForm";
import { CommunityNav } from "@/components/community/CommunityNav";
import { CommunitySafetyNotice } from "@/components/community/CommunitySafetyNotice";
import { CommunityShell } from "@/components/community/CommunityShell";
import { CommunitySubmissionList } from "@/components/community/CommunitySubmissionList";
import { getSessionUser, isApprovedUser } from "@/lib/auth/session";
import { getUserCommunitySubmissions } from "@/lib/queries/community";

export const metadata = {
  title: "Community Builder // Signal Planter",
};

export default async function CommunityBuilderPage() {
  const user = await getSessionUser();
  const approved = user ? isApprovedUser(user) : false;
  const submissions = user ? await getUserCommunitySubmissions(user.id) : [];

  return (
    <CommunityShell
      title="COMMUNITY BUILDER // SIGNAL PLANTER"
      subtitle="Plant a signal for the Underwatch. Suggest a thread, mission, cipher, resource, lore fragment, accessibility note, or creator tool."
    >
      <CommunityNav active="/community/builder" />
      <CommunityBuilderForm
        disabled={!approved}
        lockedMessage={
          !user
            ? "Sign in to plant community signals."
            : "This relay opens after operative approval."
        }
      />
      {submissions.length > 0 && (
        <div className="mt-8">
          <CommunitySubmissionList submissions={submissions} />
        </div>
      )}
      <CommunitySafetyNotice />
    </CommunityShell>
  );
}
