import { AccessDenied } from "@/components/layout/AccessDenied";
import { ModerationNav } from "@/components/moderation/ModerationNav";
import { TerminalPanel } from "@/components/terminal/TerminalPanel";
import { getRecentNotes } from "@/lib/actions/moderation";
import { requireModeratorUser } from "@/lib/auth/guards";

export const metadata = { title: "Moderation Notes" };

export default async function ModerationNotesPage() {
  const mod = await requireModeratorUser();
  if (!mod.ok) {
    return <AccessDenied title="Access Denied" message="Moderation clearance required." />;
  }

  const notes = await getRecentNotes(50);

  return (
    <div className="mx-auto max-w-4xl px-4 py-16">
      <h1 className="mb-4 font-mono text-3xl tracking-widest uppercase">Mod Notes</h1>
      <ModerationNav active="/moderation/notes" />

      <TerminalPanel title="notes.recent">
        <div className="space-y-4">
          {notes.map((n) => (
            <div key={n.id} className="border-b border-border/30 pb-3 font-mono text-sm">
              <p className="text-xs text-muted-foreground">
                {n.subject.email} — by {n.author?.email ?? "unknown"} — {n.createdAt.toLocaleString()}
              </p>
              <p className="mt-1 text-foreground/80">{n.body}</p>
            </div>
          ))}
        </div>
      </TerminalPanel>
    </div>
  );
}
