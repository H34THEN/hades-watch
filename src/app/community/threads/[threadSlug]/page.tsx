import { notFound } from "next/navigation";
import { CommunityNav } from "@/components/community/CommunityNav";
import { CommunityShell } from "@/components/community/CommunityShell";
import { ForumThreadView } from "@/components/community/ForumThreadView";
import { ForumThreadSidebar } from "@/components/forums/ForumThreadSidebar";
import { formatCommunityBody } from "@/lib/community/sanitize";
import { getSessionUser, isApprovedUser } from "@/lib/auth/session";
import { getForumComments, getForumThreadBySlug } from "@/lib/queries/community";
import { getForumUserPreference } from "@/lib/queries/forum-identity";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ threadSlug: string }>;
}) {
  const { threadSlug } = await params;
  const thread = await getForumThreadBySlug(threadSlug);
  return { title: thread ? `${thread.title} // Thread` : "Thread" };
}

export default async function ForumThreadPage({
  params,
}: {
  params: Promise<{ threadSlug: string }>;
}) {
  const { threadSlug } = await params;
  const thread = await getForumThreadBySlug(threadSlug);

  if (
    !thread ||
    thread.status === "HIDDEN" ||
    thread.status === "REMOVED"
  ) {
    notFound();
  }

  const user = await getSessionUser();
  const approved = user ? isApprovedUser(user) : false;
  const [comments, prefs] = await Promise.all([
    getForumComments(thread.id),
    user ? getForumUserPreference(user.id) : Promise.resolve(null),
  ]);
  const bodyHtml = formatCommunityBody(thread.body);

  return (
    <CommunityShell title={thread.title}>
      <CommunityNav active="/community/forums" />
      <div className="hw-split-layout">
        <div className="min-w-0">
          <ForumThreadView
            thread={thread}
            bodyHtml={bodyHtml}
            comments={comments}
            currentUserId={user?.id}
            canReply={approved && thread.status === "ACTIVE"}
            hideSignatures={prefs?.hideSignatures ?? false}
          />
        </div>
        <ForumThreadSidebar thread={thread} replyCount={comments.length} />
      </div>
    </CommunityShell>
  );
}
