import type { HadesTheme } from "./types";

export function applyThemeToDocument(theme: HadesTheme): void {
  const root = document.documentElement;
  root.setAttribute("data-theme", theme.id);

  const vars = theme.cssVariables;
  root.style.setProperty("--background", vars.background);
  root.style.setProperty("--foreground", vars.foreground);
  root.style.setProperty("--card", vars.card);
  root.style.setProperty("--card-foreground", vars.cardForeground);
  root.style.setProperty("--primary", vars.primary);
  root.style.setProperty("--primary-foreground", vars.primaryForeground);
  root.style.setProperty("--secondary", vars.secondary);
  root.style.setProperty("--secondary-foreground", vars.secondaryForeground);
  root.style.setProperty("--muted", vars.muted);
  root.style.setProperty("--muted-foreground", vars.mutedForeground);
  root.style.setProperty("--accent", vars.accent);
  root.style.setProperty("--accent-foreground", vars.accentForeground);
  root.style.setProperty("--destructive", vars.destructive);
  root.style.setProperty("--border", vars.border);
  root.style.setProperty("--ring", vars.ring);
  root.style.setProperty("--hw-glow", vars.glow);
  root.style.setProperty("--popover", vars.card);
  root.style.setProperty("--popover-foreground", vars.cardForeground);
  root.style.setProperty("--input", vars.border);
}
