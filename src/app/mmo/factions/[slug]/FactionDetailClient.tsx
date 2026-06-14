"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { MmoNav } from "@/components/mmo/MmoNav";
import { CommandButton } from "@/components/terminal/CommandButton";
import { TerminalPanel } from "@/components/terminal/TerminalPanel";
import { requestFactionJoinAction } from "@/lib/actions/mmo";

interface FactionDetailPageProps {
  faction: {
    id: string;
    slug: string;
    name: string;
    description: string | null;
    quests: { id: string; slug: string; title: string }[];
    characters: { callsign: string; archetype: string | null }[];
    _count: { characters: number; memberships: number };
  };
  membershipStatus?: string | null;
}

export function FactionDetailClient({ faction, membershipStatus }: FactionDetailPageProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function handleJoin() {
    startTransition(async () => {
      await requestFactionJoinAction(faction.id);
      router.refresh();
    });
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      <MmoNav active="/mmo/factions" />
      <TerminalPanel title={`faction.${faction.slug}`}>
        <h1 className="font-mono text-2xl tracking-widest uppercase text-primary">{faction.name}</h1>
        <p className="mt-4 text-sm leading-relaxed text-foreground/80">{faction.description}</p>
        <p className="mt-4 font-mono text-xs text-muted-foreground">
          {faction._count.characters} operatives · {faction._count.memberships} members
        </p>
        {membershipStatus ? (
          <p className="mt-2 font-mono text-xs text-primary">Your request: {membershipStatus}</p>
        ) : (
          <CommandButton className="mt-6" onClick={handleJoin} disabled={isPending}>
            Request Membership
          </CommandButton>
        )}
      </TerminalPanel>

      {faction.quests.length > 0 && (
        <TerminalPanel title="faction.missions" className="mt-6">
          {faction.quests.map((q) => (
            <Link key={q.id} href={`/mmo/missions/${q.slug}`} className="block py-2 font-mono text-sm text-primary hover:underline">
              {q.title}
            </Link>
          ))}
        </TerminalPanel>
      )}
    </div>
  );
}
