"use client";

import { ThemePreviewCard } from "@/components/theme/ThemePreviewCard";
import { useTheme } from "@/components/theme/ThemeProvider";
import { AssetPlaceholder } from "@/components/assets/AssetPlaceholder";
import { TerminalPanel } from "@/components/terminal/TerminalPanel";

export default function ThemesPage() {
  const { themes, themeId, setThemeId, theme } = useTheme();

  return (
    <div className="mx-auto max-w-6xl px-4 py-16">
      <h1 className="mb-2 font-mono text-3xl tracking-widest uppercase">
        Themes
      </h1>
      <p className="mb-8 max-w-2xl text-muted-foreground">
        Eight visual identities. CSS variables with localStorage persistence.
        Asset slots are placeholders until custom media is added.
      </p>

      <div className="mb-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {themes.map((t) => (
          <ThemePreviewCard
            key={t.id}
            theme={t}
            active={t.id === themeId}
            onSelect={setThemeId}
          />
        ))}
      </div>

      <TerminalPanel title="active.theme.assets">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <AssetPlaceholder type="Logo" path={theme.assets.logo ?? ""} />
          <AssetPlaceholder
            type="Background"
            path={theme.assets.backgroundImage ?? ""}
            aspect="video"
          />
          <AssetPlaceholder
            type="Texture"
            path={theme.assets.textureOverlay ?? ""}
          />
          <AssetPlaceholder type="Favicon" path={theme.assets.favicon ?? ""} />
        </div>
      </TerminalPanel>
    </div>
  );
}
