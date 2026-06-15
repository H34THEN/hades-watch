import Link from "next/link";
import { NetNeighborSubmitForm } from "@/components/net-neighbors/NetNeighborSubmitForm";
import { NetNeighborsWall } from "@/components/net-neighbors/NetNeighborsWall";
import { CommandButton } from "@/components/terminal/CommandButton";
import { TerminalPanel } from "@/components/terminal/TerminalPanel";
import { isModerator } from "@/lib/auth/roles";
import { requireApprovedAuth } from "@/lib/auth/session";
import { countPendingNetNeighbors, getApprovedNetNeighbors } from "@/lib/queries/net-neighbors";

export const metadata = { title: "Net Neighbors" };

export default async function NetNeighborsPage() {
  const user = await requireApprovedAuth();
  const [neighbors, pendingCount] = await Promise.all([
    getApprovedNetNeighbors(),
    isModerator(user.roles) ? countPendingNetNeighbors() : Promise.resolve(0),
  ]);

  return (
    <div className="mx-auto max-w-5xl px-4 py-16">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-mono text-3xl tracking-widest uppercase">Net Neighbors</h1>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
            Net Neighbors are the small doors in the Underwatch wall. Follow at your own risk.
            Bring back anything beautiful, useful, strange, or kind.
          </p>
        </div>
        {isModerator(user.roles) && pendingCount > 0 && (
          <Link href="/admin/social">
            <CommandButton size="sm" variant="outline">
              Review ({pendingCount} pending)
            </CommandButton>
          </Link>
        )}
      </div>

      <TerminalPanel title="banner.wall">
        <p className="mb-4 font-mono text-[10px] tracking-wider text-muted-foreground uppercase">
          Outbound links leave Hades Watch · rel=noopener noreferrer
        </p>
        <NetNeighborsWall neighbors={neighbors} />
      </TerminalPanel>

      <TerminalPanel title="club.buttons" className="mt-8">
        <p className="font-mono text-xs text-muted-foreground">
          Hades Watch club buttons — coming soon. Submit your own neighbor below.
        </p>
      </TerminalPanel>

      <NetNeighborSubmitForm />
    </div>
  );
}
