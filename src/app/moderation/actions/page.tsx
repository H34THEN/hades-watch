import { AccessDenied } from "@/components/layout/AccessDenied";
import { ModerationNav } from "@/components/moderation/ModerationNav";
import { TerminalPanel } from "@/components/terminal/TerminalPanel";
import { getModerationActions } from "@/lib/actions/moderation";
import { requireModeratorUser } from "@/lib/auth/guards";

export const metadata = { title: "Moderation Actions" };

export default async function ModerationActionsPage() {
  const mod = await requireModeratorUser();
  if (!mod.ok) {
    return <AccessDenied title="Access Denied" message="Moderation clearance required." />;
  }

  const actions = await getModerationActions();

  return (
    <div className="mx-auto max-w-4xl px-4 py-16">
      <h1 className="mb-4 font-mono text-3xl tracking-widest uppercase">Mod Actions</h1>
      <ModerationNav active="/moderation/actions" />

      <TerminalPanel title="audit.moderation">
        <div className="space-y-2 font-mono text-xs">
          {actions.map((a) => (
            <div key={a.id} className="flex justify-between border-b border-border/30 py-1">
              <span className="text-primary">{a.action}</span>
              <span className="text-muted-foreground">
                {a.actor?.email ?? "system"} — {a.createdAt.toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      </TerminalPanel>
    </div>
  );
}
