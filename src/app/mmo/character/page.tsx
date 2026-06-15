import { CharacterForm } from "@/components/mmo/CharacterForm";
import { MmoNav } from "@/components/mmo/MmoNav";
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
    <div className="mx-auto max-w-lg px-4 py-16">
      <h1 className="mb-4 font-mono text-3xl tracking-widest uppercase">Character</h1>
      <MmoNav active="/mmo/character" />
      <TerminalPanel title="character.record">
        <CharacterForm
          initial={character ?? undefined}
          factions={factions}
        />
      </TerminalPanel>
    </div>
  );
}
