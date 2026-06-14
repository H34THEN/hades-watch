import { TerminalPanel } from "@/components/terminal/TerminalPanel";
import { SpotifyPlaylistForm } from "@/components/profile/SpotifyPlaylistForm";
import type { DossierData } from "@/lib/queries/dossier";

interface SignalSoundtrackSectionProps {
  dossier: DossierData;
}

export function SignalSoundtrackSection({ dossier }: SignalSoundtrackSectionProps) {
  return (
    <TerminalPanel title="signal.soundtrack" className="mb-8">
      <p className="mb-4 font-mono text-xs text-muted-foreground">
        Field audio broadcast — public Spotify playlist embed.
      </p>
      {dossier.spotify ? (
        <div className="mb-6 overflow-hidden rounded-lg border border-border/50">
          <iframe
            src={dossier.spotify.embedUrl}
            width="100%"
            height="352"
            loading="lazy"
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
            title="Dossier playlist"
            className="border-0 bg-transparent"
          />
        </div>
      ) : (
        <p className="mb-4 font-mono text-sm text-muted-foreground italic">
          No signal soundtrack linked. Add a playlist below to broadcast on your dossier.
        </p>
      )}
      <SpotifyPlaylistForm currentUrl={dossier.spotify?.canonicalUrl ?? null} />
    </TerminalPanel>
  );
}
