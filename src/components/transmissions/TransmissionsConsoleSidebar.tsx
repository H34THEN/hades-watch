import Link from "next/link";
import { CommandButton } from "@/components/terminal/CommandButton";
import { TerminalPanel } from "@/components/terminal/TerminalPanel";
import type { TransmissionPriority } from "@/generated/prisma/client";

interface FeaturedTransmission {
  title: string;
  body: string;
  priority: TransmissionPriority;
  pinned: boolean;
}

interface TransmissionsConsoleSidebarProps {
  count: number;
  pinnedCount: number;
  featured?: FeaturedTransmission | null;
}

export function TransmissionsConsoleSidebar({
  count,
  pinnedCount,
  featured,
}: TransmissionsConsoleSidebarProps) {
  return (
    <aside className="min-w-0 space-y-4">
      <TerminalPanel title="transmission.console">
        <dl className="space-y-2 font-mono text-xs">
          <div className="flex justify-between gap-2">
            <dt className="text-muted-foreground">Active</dt>
            <dd>{count}</dd>
          </div>
          <div className="flex justify-between gap-2">
            <dt className="text-muted-foreground">Pinned</dt>
            <dd>{pinnedCount}</dd>
          </div>
        </dl>
        <Link href="/dashboard" className="mt-4 inline-block">
          <CommandButton size="sm" variant="outline">
            ← Dashboard
          </CommandButton>
        </Link>
      </TerminalPanel>

      {featured ? (
        <TerminalPanel title={featured.pinned ? "transmission.pinned" : "transmission.featured"}>
          <p className="font-mono text-sm font-semibold uppercase text-primary">{featured.title}</p>
          <p className="mt-2 line-clamp-6 text-sm leading-relaxed text-muted-foreground">
            {featured.body}
          </p>
          <p className="mt-2 font-mono text-[10px] text-muted-foreground uppercase">
            Priority: {featured.priority}
          </p>
        </TerminalPanel>
      ) : null}

      <TerminalPanel title="transmission.relay">
        <ul className="space-y-1 font-mono text-xs">
          <li>
            <Link href="/dashboard/events" className="text-primary hover:underline">
              Event calendar
            </Link>
          </li>
          <li>
            <Link href="/mmo" className="text-primary hover:underline">
              MMO Hub
            </Link>
          </li>
          <li>
            <Link href="/archive" className="text-primary hover:underline">
              Archive index
            </Link>
          </li>
        </ul>
      </TerminalPanel>
    </aside>
  );
}
