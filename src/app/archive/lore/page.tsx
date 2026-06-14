import Link from "next/link";
import { LockedCard } from "@/components/archive/LockedCard";
import { UnlockLoreButton } from "@/components/archive/UnlockLoreButton";
import { TerminalPanel } from "@/components/terminal/TerminalPanel";
import { getLoreForUser } from "@/lib/actions/lore";
import { requireAuth } from "@/lib/auth/session";

export const metadata = { title: "Lore Archive" };

export default async function LoreArchivePage() {
  const user = await requireAuth();
  const entries = await getLoreForUser(user.id, user.roles);

  return (
    <div className="mx-auto max-w-4xl px-4 py-16">
      <h1 className="mb-4 font-mono text-3xl tracking-widest uppercase">Lore Archive</h1>
      <div className="space-y-4">
        {entries.map((entry) =>
          entry.canRead ? (
            <Link key={entry.id} href={`/archive/lore/${entry.slug}`}>
              <TerminalPanel title={`lore.${entry.slug}`}>
                <h3 className="font-mono text-sm font-semibold uppercase text-primary">{entry.title}</h3>
                {entry.excerpt && (
                  <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{entry.excerpt}</p>
                )}
              </TerminalPanel>
            </Link>
          ) : (
            <div key={entry.id}>
              <LockedCard
                title={entry.title}
                reason={
                  !entry.accessible
                    ? "Clearance or faction requirement not met"
                    : "Entry not yet unlocked"
                }
              />
              {entry.accessible && !entry.unlocked && (
                <div className="mt-2">
                  <UnlockLoreButton loreEntryId={entry.id} />
                </div>
              )}
            </div>
          )
        )}
      </div>
    </div>
  );
}
