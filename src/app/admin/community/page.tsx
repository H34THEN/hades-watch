import Link from "next/link";
import { AdminCommunityPanel } from "@/components/admin/AdminCommunityPanel";
import { AccessDenied } from "@/components/layout/AccessDenied";
import { CommandButton } from "@/components/terminal/CommandButton";
import { TerminalPanel } from "@/components/terminal/TerminalPanel";
import {
  getCommunityAdminQueue,
  getCommunityAdminStats,
} from "@/lib/queries/community-admin";
import { isModerator } from "@/lib/auth/roles";
import { getSessionUser } from "@/lib/auth/session";

export const metadata = { title: "Community Admin" };

export default async function AdminCommunityPage() {
  const user = await getSessionUser();
  if (!user || !isModerator(user.roles)) {
    return (
      <AccessDenied
        title="Moderator Clearance Required"
        message="Community admin queues require Moderator clearance or higher."
      />
    );
  }

  const [stats, queue] = await Promise.all([
    getCommunityAdminStats(),
    getCommunityAdminQueue(),
  ]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-16">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-mono text-3xl tracking-widest uppercase">
            Community Admin
          </h1>
          <p className="text-muted-foreground">
            Review builder signals, volunteer responses, guild requests, and lore submissions.
          </p>
        </div>
        <Link href="/admin">
          <CommandButton size="sm" variant="outline">
            ← Admin Console
          </CommandButton>
        </Link>
      </div>

      <TerminalPanel title="community.stats" className="mb-8">
        <dl className="grid gap-3 font-mono text-sm sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <dt className="text-muted-foreground">PENDING BUILDER</dt>
            <dd>{stats.pendingSubmissions}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">PENDING VOLUNTEER</dt>
            <dd>{stats.pendingVolunteerResponses}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">PENDING GUILDS</dt>
            <dd>{stats.pendingGuilds}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">PENDING LORE</dt>
            <dd>{stats.pendingLore}</dd>
          </div>
        </dl>
      </TerminalPanel>

      <AdminCommunityPanel
        submissions={queue.submissions}
        volunteerResponses={queue.volunteerResponses}
        guilds={queue.guilds}
        lore={queue.lore}
      />
    </div>
  );
}
