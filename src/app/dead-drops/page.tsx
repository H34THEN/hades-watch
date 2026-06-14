import Link from "next/link";
import { LockedCard } from "@/components/archive/LockedCard";
import { RoleplayDisclaimer } from "@/components/terminal/RoleplayDisclaimer";
import { TerminalPanel } from "@/components/terminal/TerminalPanel";
import { getDeadDropsForUser } from "@/lib/actions/phase4";
import { requireAuth } from "@/lib/auth/session";

export const metadata = { title: "Dead Drops" };

export default async function DeadDropsPage() {
  const user = await requireAuth();
  const drops = await getDeadDropsForUser(user.roles);

  return (
    <div className="mx-auto max-w-4xl px-4 py-16">
      <h1 className="mb-4 font-mono text-3xl tracking-widest uppercase">Dead Drops</h1>
      <RoleplayDisclaimer className="mb-8" />
      <div className="space-y-4">
        {drops.map((drop) =>
          drop.readable ? (
            <Link key={drop.id} href={`/dead-drops/${drop.slug}`}>
              <TerminalPanel title={`drop.${drop.slug}`}>
                <h3 className="font-mono text-sm font-semibold uppercase text-primary">{drop.title}</h3>
                {drop.expiresAt && (
                  <p className="mt-1 font-mono text-[10px] text-muted-foreground">
                    Expires {drop.expiresAt.toLocaleString()}
                  </p>
                )}
              </TerminalPanel>
            </Link>
          ) : (
            <LockedCard
              key={drop.id}
              title={drop.title}
              reason={
                drop.expired
                  ? "Drop expired"
                  : !drop.visible
                    ? "Clearance insufficient"
                    : "Drop unavailable"
              }
            />
          )
        )}
      </div>
    </div>
  );
}
