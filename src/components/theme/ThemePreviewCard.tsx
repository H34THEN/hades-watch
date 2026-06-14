"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { HadesTheme } from "@/lib/themes/types";

interface ThemePreviewCardProps {
  theme: HadesTheme;
  active?: boolean;
  onSelect?: (id: string) => void;
}

export function ThemePreviewCard({
  theme,
  active,
  onSelect,
}: ThemePreviewCardProps) {
  const { cssVariables: v, overlays } = theme;

  return (
    <Card
      className={cn(
        "overflow-hidden transition-all",
        active && "ring-2 ring-primary shadow-[0_0_20px_var(--hw-glow)]",
      )}
    >
      <div
        className="flex h-24 items-end gap-1 p-3"
        style={{ background: v.background }}
      >
        <div
          className="h-8 w-8 rounded-sm"
          style={{ background: v.primary }}
        />
        <div
          className="h-6 flex-1 rounded-sm"
          style={{ background: v.secondary }}
        />
        <div
          className="h-4 w-12 rounded-sm"
          style={{ background: v.accent }}
        />
      </div>
      <CardHeader className="pb-2">
        <CardTitle className="text-base">{theme.name}</CardTitle>
        <CardDescription>{theme.description}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-wrap gap-1.5 pt-0">
        {overlays.scanlines && (
          <span className="rounded border border-border px-1.5 py-0.5 text-xs text-muted-foreground">
            scanlines
          </span>
        )}
        {overlays.glow && (
          <span className="rounded border border-border px-1.5 py-0.5 text-xs text-muted-foreground">
            glow
          </span>
        )}
        {overlays.noise && (
          <span className="rounded border border-border px-1.5 py-0.5 text-xs text-muted-foreground">
            noise
          </span>
        )}
        {overlays.vignette && (
          <span className="rounded border border-border px-1.5 py-0.5 text-xs text-muted-foreground">
            vignette
          </span>
        )}
        {onSelect && (
          <Button
            size="sm"
            variant={active ? "default" : "outline"}
            className="ml-auto"
            onClick={() => onSelect(theme.id)}
          >
            {active ? "Active" : "Apply"}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
