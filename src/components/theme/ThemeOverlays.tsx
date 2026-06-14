"use client";

import { useTheme } from "@/components/theme/ThemeProvider";
import { NoiseOverlay } from "@/components/overlays/NoiseOverlay";
import { ScanlineOverlay } from "@/components/overlays/ScanlineOverlay";

export function ThemeOverlays() {
  const { theme } = useTheme();
  const { overlays } = theme;

  return (
    <>
      {overlays.scanlines && <ScanlineOverlay />}
      {overlays.noise && <NoiseOverlay />}
      {overlays.vignette && (
        <div
          aria-hidden
          className="pointer-events-none fixed inset-0 z-40"
          style={{
            background:
              "radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.55) 100%)",
          }}
        />
      )}
      {overlays.glow && (
        <div
          aria-hidden
          className="pointer-events-none fixed inset-0 z-30 opacity-30"
          style={{
            background:
              "radial-gradient(ellipse at 50% 0%, var(--hw-glow) 0%, transparent 60%)",
          }}
        />
      )}
    </>
  );
}
