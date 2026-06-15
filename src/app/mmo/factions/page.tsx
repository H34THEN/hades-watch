import { MmoNav } from "@/components/mmo/MmoNav";
import { AllianceHero } from "@/components/factions/AllianceHero";
import { FactionCellCard } from "@/components/factions/FactionCellCard";
import { getAlliance, getFactions } from "@/lib/actions/mmo";
import { getSessionUser } from "@/lib/auth/session";
import { usesCanonicalFallback } from "@/lib/factions/resolve";

export const metadata = { title: "Factions" };

export default async function FactionsPage() {
  const user = await getSessionUser();
  const [factions, alliance] = await Promise.all([getFactions(), getAlliance()]);

  return (
    <div className="mx-auto max-w-5xl px-4 py-16">
      <h1 className="mb-2 font-mono text-3xl tracking-widest uppercase">Faction Dossiers</h1>
      <p className="mb-6 font-mono text-xs text-muted-foreground">
        Classified cell registry — The Chthonic Uprising
      </p>
      <MmoNav active="/mmo/factions" />

      {alliance && (
        <AllianceHero
          alliance={alliance}
          roles={user?.roles}
          showSeedWarning={usesCanonicalFallback(factions)}
        />
      )}

      <div className="mb-4">
        <h2 className="font-mono text-sm tracking-widest text-primary uppercase">
          Five Founding Cells
        </h2>
        <p className="mt-1 text-xs text-muted-foreground">
          Survival · Signal · Force · Invention · Rupture
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {factions.map((f) => (
          <FactionCellCard key={f.slug} faction={f} />
        ))}
      </div>

      {factions.length === 0 && (
        <p className="font-mono text-sm text-muted-foreground">
          No faction dossiers available.
        </p>
      )}
    </div>
  );
}
