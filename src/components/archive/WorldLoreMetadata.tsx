import type { LoreEntry } from "@/generated/prisma/client";
import {
  formatFactionSlug,
  parseWorldLoreMetadata,
} from "@/lib/lore/world-lore-seed";

export function WorldLoreMetadataPanel({ entry }: { entry: LoreEntry }) {
  const meta = parseWorldLoreMetadata(entry.loreMetadata);
  if (!meta) return null;

  return (
    <div className="mt-3 space-y-2 font-mono text-[10px] text-muted-foreground">
      <p>
        <span className="text-amber-400/90">Threat Class:</span> {meta.threatClass}
      </p>
      {meta.relatedSystems.length > 0 && (
        <p>
          <span className="text-primary/80">Related Systems:</span> {meta.relatedSystems.join(" · ")}
        </p>
      )}
      {meta.relatedFactions.length > 0 && (
        <p>
          <span className="text-emerald-500/80">Related Cells:</span>{" "}
          {meta.relatedFactions.map(formatFactionSlug).join(" · ")}
        </p>
      )}
    </div>
  );
}

export function WorldLoreMetadataInline({ entry }: { entry: LoreEntry }) {
  const meta = parseWorldLoreMetadata(entry.loreMetadata);
  if (!meta) return null;

  return (
    <p className="mt-1 font-mono text-[10px] text-amber-400/80">
      {meta.threatClass}
      {meta.pack === "surface-breaks-001" ? " · Surface Breaks 001" : ""}
    </p>
  );
}
