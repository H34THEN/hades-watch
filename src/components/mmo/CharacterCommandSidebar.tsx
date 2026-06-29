import Link from "next/link";
import { CommandButton } from "@/components/terminal/CommandButton";
import { TerminalPanel } from "@/components/terminal/TerminalPanel";

interface CharacterCommandSidebarProps {
  callsign?: string | null;
  factionName?: string | null;
}

export function CharacterCommandSidebar({ callsign, factionName }: CharacterCommandSidebarProps) {
  return (
    <aside className="min-w-0 space-y-4">
      <TerminalPanel title="operative.identity">
        <dl className="space-y-2 font-mono text-xs">
          <div>
            <dt className="text-muted-foreground">Callsign</dt>
            <dd className="mt-0.5 text-sm text-primary">{callsign ?? "Unassigned"}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Faction</dt>
            <dd className="mt-0.5 text-sm">{factionName ?? "Unaffiliated"}</dd>
          </div>
        </dl>
      </TerminalPanel>

      <TerminalPanel title="operative.relay">
        <div className="flex flex-col gap-2">
          <Link href="/profile/dossier">
            <CommandButton size="sm" variant="outline" className="w-full">
              Character Dossier
            </CommandButton>
          </Link>
          <Link href="/profile/avatar">
            <CommandButton size="sm" variant="outline" className="w-full">
              Avatar Builder
            </CommandButton>
          </Link>
          <Link href="/profile/badges">
            <CommandButton size="sm" variant="outline" className="w-full">
              Badge Case
            </CommandButton>
          </Link>
          <Link href="/profile/relic-zone">
            <CommandButton size="sm" variant="outline" className="w-full">
              Relic Zone
            </CommandButton>
          </Link>
          <Link href="/profile/world">
            <CommandButton size="sm" variant="outline" className="w-full">
              Profile World
            </CommandButton>
          </Link>
        </div>
      </TerminalPanel>

      <TerminalPanel title="field.ops">
        <div className="flex flex-col gap-2">
          <Link href="/mmo/missions">
            <CommandButton size="sm" variant="outline" className="w-full">
              Missions
            </CommandButton>
          </Link>
          <Link href="/dead-drops">
            <CommandButton size="sm" variant="outline" className="w-full">
              Field Care Dead Drops
            </CommandButton>
          </Link>
          <Link href="/mmo/field-log">
            <CommandButton size="sm" variant="outline" className="w-full">
              Field Log
            </CommandButton>
          </Link>
        </div>
      </TerminalPanel>
    </aside>
  );
}
