import Link from "next/link";
import { DashboardCard } from "@/components/cards/DashboardCard";
import { CommandButton } from "@/components/terminal/CommandButton";
import { TerminalPanel } from "@/components/terminal/TerminalPanel";
import { getLoreForUser } from "@/lib/actions/lore";
import { requireAuth } from "@/lib/auth/session";

export const metadata = { title: "Archive" };

export default async function ArchivePage() {
  const user = await requireAuth();
  const entries = await getLoreForUser(user.id, user.roles);
  const unlocked = entries.filter((e) => e.canRead).length;

  return (
    <div className="mx-auto max-w-4xl px-4 py-16">
      <h1 className="mb-4 font-mono text-3xl tracking-widest uppercase">Archive</h1>
      <TerminalPanel title="archive.status" className="mb-8">
        <p className="font-mono text-sm text-muted-foreground">
          {unlocked} of {entries.length} lore entries accessible
        </p>
        <Link href="/archive/lore" className="mt-4 inline-block">
          <CommandButton size="sm">Browse Lore</CommandButton>
        </Link>
      </TerminalPanel>
      <DashboardCard title="Lore Archive" description="Classified fragments and recovered transmissions" icon={<span>◫</span>}>
        <Link href="/archive/lore"><CommandButton size="sm">Enter</CommandButton></Link>
      </DashboardCard>
    </div>
  );
}
