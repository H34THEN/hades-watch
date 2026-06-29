import { CharacterForm } from "@/components/mmo/CharacterForm";
import { CharacterCommandSidebar } from "@/components/mmo/CharacterCommandSidebar";
import { MmoNav } from "@/components/mmo/MmoNav";
import { PageShell } from "@/components/layout/PageShell";
import { TerminalPanel } from "@/components/terminal/TerminalPanel";
import { getFactionsForAdmin, getUserCharacter } from "@/lib/actions/mmo";
import { requireAuth } from "@/lib/auth/session";

export const metadata = { title: "Character" };

export default async function CharacterPage() {
  const user = await requireAuth();
  const [character, factions] = await Promise.all([
    getUserCharacter(user.id),
    getFactionsForAdmin(),
  ]);

  return (
    <PageShell variant="split" scanlines>
      <div className="min-w-0">
        <h1 className="mb-2 font-mono text-3xl tracking-widest uppercase">Character Command</h1>
        <p className="mb-4 hw-readable-wide text-sm text-muted-foreground">
          Operative record, callsign, faction alignment, and field identity.
        </p>
        <MmoNav active="/mmo/character" />
        <TerminalPanel title="character.record" className="mt-6">
          <CharacterForm initial={character ?? undefined} factions={factions} />
        </TerminalPanel>
      </div>

      <CharacterCommandSidebar
        callsign={character?.callsign}
        factionName={character?.faction?.name}
      />
    </PageShell>
  );
}
