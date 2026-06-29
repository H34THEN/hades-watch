import { AdminForumIdentityPanel } from "@/components/admin/AdminForumIdentityPanel";
import { AccessDenied } from "@/components/layout/AccessDenied";
import { getForumIdentityModerationQueue } from "@/lib/queries/forum-identity";
import { isModerator } from "@/lib/auth/roles";
import { getSessionUser } from "@/lib/auth/session";

export const metadata = { title: "Forum Signatures Moderation" };

export default async function AdminForumSignaturesPage() {
  const user = await getSessionUser();
  if (!user || !isModerator(user.roles)) {
    return (
      <AccessDenied
        title="Moderator Clearance Required"
        message="Forum signature moderation requires Moderator clearance or higher."
      />
    );
  }

  const queue = await getForumIdentityModerationQueue();

  return (
    <div className="mx-auto max-w-6xl px-4 py-16 space-y-6">
      <div>
        <h1 className="font-mono text-3xl tracking-widest uppercase">Forum Signatures</h1>
        <p className="text-muted-foreground">
          Moderate uploaded and generated forum buttons and banners.
        </p>
      </div>
      <AdminForumIdentityPanel queue={queue} showAssetsOnly />
    </div>
  );
}
